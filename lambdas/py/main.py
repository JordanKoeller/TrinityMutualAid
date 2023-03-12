import os
import json
from typing import List
import time

import boto3
from aws_lambda_types.api_gw import APIGWPayloadV1RequestDict, APIGWPayloadV1RequestContextDict
from instaloader import Instaloader
from boto3.dynamodb.conditions import Key

VALID_ORIGINS = [
  "http://trinitymutualaid.com",
  "https://trinitymutualaid.com",
  "http://dev.trinitymutualaid.com",
  "https://dev.trinitymutualaid.com",
  "http://staging.trinitymutualaid.com",
  "https://staging.trinitymutualaid.com",
  "http://www.trinitymutualaid.com",
  "https://www.trinitymutualaid.com",
]

IMAGE_EXTENSIONS = [
  'jpg', 'png', 'svg', 'tiff', 'gif', 'tif', 'jpeg', 'eps', 'bmp',
]

def api_handler(event: APIGWPayloadV1RequestDict, context: APIGWPayloadV1RequestContextDict):
  """Entrypoing for getting handle(s) as requested via the api"""
  print(event)
  handles = json.loads(event['body'])
  raw_handles = [h.replace('@', '') for h in handles]
  premade_profiles = query_db_for_handles(raw_handles)
  for handle in raw_handles:
    if handle not in premade_profiles:
      handle_record = refresh_handle(handle)
      premade_profiles[handle] = handle_record
  print("With profiles", premade_profiles)
  return make_response(json.dumps(premade_profiles), 200, event)

def timer_handler():
  """Handler for cron entrypoint to auto-refresh handles"""
  cutoff = int(time.time()) - 3600 * 24 # Refresh every day
  for handle in query_stale_handles(cutoff_time):
    refresh_handle(handle)


def refresh_handle(handle: str) -> dict:
  """
  Given a handle, queries instagram, uploads the file to s3 and the meta to dynamodb,
  and returns the new record created in dynamodb.
  """
  tmp_filename = download_profile(handle)
  target_name = "handles/" + handle + "." + tmp_filename.split('.')[-1]
  s3_filename = upload_to_s3(tmp_filename, target_name)
  asset_url = os.environ['CDN_ORIGIN'] + '/' + s3_filename
  now = int(time.time())
  handle_record = {
    'handle': handle,
    'asset': asset_url,
    'create_time': now,
    'update_time': now,
  }
  upsert_dynamodb_record(handle_record)
  return handle_record


def download_profile(instagram_handle: str) -> str:
  '''Returns downloaded file name'''
  install_directory = f'/tmp/downloads/{instagram_handle}'
  try:
    loader = Instaloader(dirname_pattern=install_directory)
    loader.download_profile(instagram_handle, profile_pic_only=True)
  except:
    print("Encountered exception during download")
  downloads = os.listdir(install_directory)
  for f in downloads:
    ext = f.split('.')[-1]
    if ext.lower() in IMAGE_EXTENSIONS:
      return f"/tmp/downloads/{instagram_handle}/{f}"
  raise ValueError(f"InstaLoader could not find a profile picture! Downloaded: {str(downloads)}")

def upload_to_s3(tmp_filename: str, target_name: str) -> str:
  s3 = boto3.resource('s3')
  s3.Bucket(os.environ['RESOURCES_BUCKET']).upload_file(tmp_filename, target_name)
  os.remove(tmp_filename)
  return target_name

############################################################
#                DynamoDb Helper Functions                 #
############################################################
def query_db_for_handles(handles: List[str]) -> dict:
  """
  Given a list of handles, query the list and return a dict of {handle: obj} from the
  handles DynamoDb Table.

  Each `obj` has a schema of:
 {
  handle: string,
  asset: string,
  create_time: int, # Unix time when inserted
  update_time: int # Unix time when last updated
}
  """
  table_name = os.environ['SOCIAL_HANDLES_TABLE']
  region = 'us-east-1'
  dynamodb = boto3.resource('dynamodb')
  response = dynamodb.batch_get_item(RequestItems={
    table_name: {
      'Keys': [{'handle': h} for h in handles],
      'ConsistentRead': False,
    }
  })
  values = response.get('Responses', {}).get(table_name, [])
  return {h['handle']: {
    'handle': h['handle'],
    'asset': h['asset'],
    'create_time': int(h['create_time']),
    'update_time': int(h['update_time'])
  } for h in values}

def query_stale_handles(cutoff_time: int) -> dict:
  """
  Return all the handles where the `update_time` is older than `cutoff_time`
  """
  table_name = os.environ['SOCIAL_HANDLES_TABLE']
  region = 'us-east-1'
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table(table_name)
  response = table.scan(
    TableName=table_name,
    FilterExpression="update_time < :cutoff",
    ExpressionAttributeValues={":cutoff": cutoff_time}
  )
  values = response.get('Items', [])
  return {h['handle']: h for h in values}

def upsert_dynamodb_record(record: dict):
  table_name = os.environ['SOCIAL_HANDLES_TABLE']
  region = 'us-east-1'
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table(table_name)
  table.put_item(TableName=table_name, Item=record)


############################################################
#                       Http Helpers                       #
############################################################

def make_response(body: str, code: int, evt: APIGWPayloadV1RequestDict) -> dict:
  headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": True,
    "Access-Control-Allow-Origin": get_allow_origin(evt),
  }
  return {
    'statusCode': code,
    'headers': headers,
    'body': body
  }

def get_allow_origin(evt: APIGWPayloadV1RequestDict) -> str:
  if evt['headers']['origin'] in VALID_ORIGINS:
    return evt['headers']['origin']
  if evt['requestContext']['stage'].lower() == 'dev':
    return "http://localhost:3000"
  return ""

############################################################
#                       Tester Code                        #
############################################################
# download_profile('trinitymutualaid')
# print(query_db_for_handles(['trinitymutualaid']))
# print(query_stale_handles(int(time.time())))
handles = ['trinitymutualaid', 'mootualaid', 'uplift.sa', 'blackfreedomfactory', 'mutualaid_sa', 'sunrise_sanantonio']
# handles = ['trinitymutualaid']
for h in handles:
  print("Refreshing handle", h)
  try:
    refresh_handle(h)
  except:
    print("Failed on handle", h)