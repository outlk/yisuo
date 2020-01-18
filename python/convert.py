#! /usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = "gzshen"

import re


def proc_js(lstAll):
    begins = []
    all_yuyan = []
    for i, v in list(enumerate(lstAll)):
        if re.findall("{", v):
            begins.append(i+1)

    # print(begins)
    
    for i in begins:
        if i == 2626:
            print(i)
            pass
        if (i+4) < len(lstAll) and re.findall("}", lstAll[i+4]):
            x = {}
            for j in range(4):
                # tmp = lstAll[i+j].split(":")
                a, b = lstAll[i+j].split(":")
                a = a.encode('utf-8').decode('unicode_escape')
                b = b.encode('utf-8').decode('unicode_escape')
                # a, b = (a.lstrip(), b.lstrip().rstrip(","))
                b = b.strip().rstrip(",")
                a = re.findall(r"^\s*\"(.*)\"$", a)[0]
                if a != "index":
                    b = re.findall(r"^\"?(.*)\"$", b)[0]

                x[a] = b
            all_yuyan.append(x)

    with open("out.tex", "w", encoding="utf-8") as texout:
        for y in all_yuyan:
            # index = y["index"]
            title = y["title"]  # .encode('utf-8').decode('unicode_escape')
            content = y["content"]  # .encode('utf-8').decode('unicode_escape')
            conclusion = y["conclusion"]
            print(title)
            if title:
                texout.writelines("\\section{{{}}}\n\n".format(title))
                texout.writelines("{}\n\n".format(content))
                texout.writelines(
                    "{{\\bfseries \\color{{red}}{}}}\n\n".format(conclusion))


def main():
    with open("../data/yisuodata.js") as jsin:
        all = jsin.readlines()

    proc_js(all)


if __name__ == "__main__":
    main()
