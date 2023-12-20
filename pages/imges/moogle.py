import urllib.parse
import pickle
import bs4
import argparse
import urllib.parse
import requests
import sys


def crawl(base,index_file,out_file):
    mapLinks = {}
    with open(index_file, 'r') as index:
        links = index.readlines()
        for link in links:
            link =link.replace('\n','')
            mapLinks[link] = {}
            full_url = urllib.parse.urljoin(base, link)
            response = requests.get(full_url)
            html = response.text
            soup = bs4.BeautifulSoup(html, 'html.parser') 
            for p in soup.find_all("p"):
                for a in p.find_all("a"):
                        target = a.get("href")
                        if target != "":
                            if not (target in mapLinks[link]):
                                  mapLinks[link][target] = 1
                            else:
                                 mapLinks[link][target] += 1
    with open(out_file, 'wb') as f:
        pickle.dump(mapLinks, f)
        f.close()  


def point_to_her(dict_trafic):
    newMap = {}
    for key,value in dict_trafic.items():
        for key1,value1 in value.items(): 
            if not (key1 in newMap):
                newMap[key1] = value1
            else:
                newMap[key1] += value1
    return newMap


def page_rank(iterations,dict_file,out_file):
    with open(dict_file, 'rb') as f:
        trafic_dict = pickle.load(f)
    search_engine = {}
    for key,value in trafic_dict.items():
        search_engine[key] = 1
    total_sum=0
    new_r = {}
    for key,value in trafic_dict.items():
        for key1,value1 in value.items():
            total_sum += value1

        for i in range(int(iterations)):
            for key1,value1 in value.items():
                search_engine[key1] += search_engine[key1] * (value1/total_sum)
        
    print(search_engine,total_sum)
    with open(out_file, 'wb') as f:
        pickle.dump(search_engine, f)
        f.close() 
        
def words_dict(base_url, index_file, out_file):
    with open(index_file, 'r') as index:
        links = index.readlines()

    words_dict = {}
    for link in links:
        link = link.replace('\n','')
        full_url = urllib.parse.urljoin(base_url, link)
        response = requests.get(full_url)
        html = response.text
        soup = bs4.BeautifulSoup(html, 'html.parser')

        for p in soup.find_all("p"):
            content = p.text
            content = content.replace('\n','')
            list2 = content.split(" ")
            for word in list2:
                if word not in words_dict:
                    words_dict[word] = {}
                if link not in words_dict[word]:
                    words_dict[word][link] = 1
                else:
                    words_dict[word][link] += 1

    with open(out_file, 'wb') as f:
        pickle.dump(words_dict, f)
        f.close()


    

#python3 moogle.py crawl https://www.cs.huji.ac.il/w~intro2cs2/ex6/wiki/ small_index.txt out.pickle
#python3 moogle.py page_rank 4 out.pickle sortie.pickle
#python3 moogle.py words_dict https://www.cs.huji.ac.il/w~intro2cs1/ex6/wiki/ small_index.txt word.pickle
if __name__ == '__main__':
    fonct = sys.argv[1]
    if fonct == "crawl":
        crawl(sys.argv[2],sys.argv[3],sys.argv[4])
    if fonct == "page_rank":
        page_rank(sys.argv[2],sys.argv[3],sys.argv[4])
    if fonct == "words_dict":
        words_dict(sys.argv[2],sys.argv[3],sys.argv[4])
    

    