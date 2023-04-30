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
      nameEn, descEn, nameEs, descEs, serviceType, link, img, coords = row
      desc_addr_en = descEn.split(":")
      if len(desc_addr_en) == 2:
        descEn, addr = desc_addr_en
      else:
        addr = ""
      desc_addr_es = descEs.split(":")
      if len(desc_addr_es) == 2:
        descEs, addr_es = desc_addr_es
      x, y = coords.split(",")
      row = [
        nameEn.strip(),
        descEn.strip(),
        nameEs.strip(),
        descEs.strip(),
        addr.strip(),
        serviceType.upper(),
        link.strip(),
        img.strip().replace(DEV_PREFIX, PROD_PREFIX),
        float(x.strip()),
        float(y.strip())
      ]
      js.append(row)
  
  with open(outfile, 'w+') as f:
    json.dump(js, f)


if __name__ == '__main__':
  infile, outfile = sys.argv[1], sys.argv[2]
  main(infile, outfile)