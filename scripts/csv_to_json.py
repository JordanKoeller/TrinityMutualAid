import json
import csv
import sys

PROD_PREFIX = "https://cdn.trinitymutualaid.com/"
DEV_PREFIX = "https://dev-tma-files.s3.amazonaws.com/"

def main(infile: str, outfile: str):
  js = []
  with open(infile) as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
      name, desc, link, img, coords = row
      desc_addr = desc.split(":")
      if len(desc_addr) == 2:
        desc, addr = desc_addr
      else:
        addr = ""
      x, y = coords.split(",")
      row = [name.strip(), desc.strip(), addr.strip(), link.strip(), img.strip().replace(DEV_PREFIX, PROD_PREFIX), float(x.strip()), float(y.strip())]
      js.append(row)
  
  with open(outfile, 'w+') as f:
    json.dump(js, f)


if __name__ == '__main__':
  infile, outfile = sys.argv[1], sys.argv[2]
  main(infile, outfile)