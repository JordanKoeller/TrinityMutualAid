import boto3
import os
import argparse
import subprocess

dynamodb = boto3.resource('dynamodb')

parser = argparse.ArgumentParser()
parser.add_argument("--from_table", help="DynamoDb table to copy from")
parser.add_argument("--to_table", help="DynamoDb table to copy to")
parser.add_argument("--from_bucket", help="S3 Bucket to copy from")
parser.add_argument("--to_bucket", help="S3 Bucket to copy to")
args = parser.parse_args()

def get_to_from_tables():
  return args.from_table, args.to_table

def get_to_from_buckets():
  return args.from_bucket, args.to_bucket

def get_page(from_table, page_token=None) -> (list, str):
  table = dynamodb.Table(from_table)
  if page_token:
    response = table.scan(TableName=from_table, ExclusiveStartKey=page_token)
  else:
    response = table.scan(TableName=from_table)
  return response.get('Items', []), response.get('LastEvaluatedKey', None)
  

def foreach_page(from_table, func):
  counter = 0
  page, page_token = get_page(from_table)
  counter += len(page)
  func(page)
  while page_token:
    counter += len(page)
    page, page_token = get_page(from_table, page_token)
    func(page)
  print("Procesed ", counter, " records")

def batch_upload(to_table, item_batch):
  table = dynamodb.Table(to_table)
  with table.batch_writer() as batch:
    for item in item_batch:
      batch.put_item(Item=item)

def sync_s3(from_bucket, to_bucket):
  cmd = f"aws s3 sync s3://{from_bucket} s3://{to_bucket}"
  subprocess.check_output(cmd.split(" "))
  print(f"Copied from {from_bucket} to {to_bucket}")

def main():
  from_table, to_table = get_to_from_tables()
  if from_table and to_table:
    foreach_page(from_table, lambda page: batch_upload(to_table, page))
  from_bucket, to_bucket = get_to_from_buckets()
  if from_bucket and to_bucket:
    sync_s3(from_bucket, to_bucket)

if __name__ == '__main__':
  main()