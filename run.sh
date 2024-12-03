docker built -t csci8980 .
docker run -it \ 
    --gpus all \
    -v ./fusionViz:/root/fusionViz \
    -p 1234:1234 -p 3000:3000 \
    -e OPENAI_API_KEY=$OPENAI_API_KEY --name fusionViz csci8980