#!/bin/sh

img=${1%.*}
filename="$img.txt"
content="---
layout: gallery
category: gallery
thumb: /images/screenies/thumbs/$img-thumb.png
image: /images/screenies/$img.png
---"

convert -resize 125 "$1" "thumbs/$img-thumb.png"
echo "$content" > "../../_posts/$filename"
