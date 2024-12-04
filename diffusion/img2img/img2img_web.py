import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
import argparse
import base64
from openai import OpenAI

client = OpenAI()
torch.manual_seed(1234)
model_id = "timbrooks/instruct-pix2pix"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id,cache_dir="./model", torch_dtype=torch.float32, safety_checker=None)
pipe = pipe.to("mps")
# pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
pipe.enable_attention_slicing()

def input_preprocessing(path):
    image = PIL.Image.open(path)
    image = PIL.ImageOps.exif_transpose(image)
    image = image.convert("RGB")
    image = image.resize((512, 512))
    return image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')  
def main(img_path,prompt,steps,guidance):
    image = input_preprocessing(img_path)
    base64_image = encode_image(img_path)

    prompt=[
        {"role": "system", "content": '''You are an stable-diffusion prompt summarizer. Your job is to create a well estiblished prompt based on the user input key words and input image. Important is the new prompt need to be limited to 77 tokens!}
            '''}
    ]
    prompt.append(
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": f"{prompt}",
            },
            {
                "type": "image_url",
                "image_url": {
                "url":  f"data:image/jpeg;base64,{base64_image}"
                },
            },
            ],
        }
        )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=prompt,
    )

    # Get the response content
    new_prompt = response.choices[0].message.content
    print(new_prompt)
    images = pipe(new_prompt, image=image, num_inference_steps=steps,guidance_scale=guidance, image_guidance_scale=1.1).images
    images[0].save(img_path[:-4]+"_new.png")

if __name__=="__main__":
  parser = argparse.ArgumentParser(description="Process a file path input.")
  parser.add_argument(
      'img_path', 
      type=str, 
      help="The path to the file to process"
  )
  parser.add_argument(
      'prompt', 
      type=str, 
      help="The path to the file to process"
  )
  parser.add_argument(
      'steps', 
      type=int, 
      help="The path to the file to process"
  )
  parser.add_argument(
      'guidance', 
      type=float, 
      help="The path to the file to process"
  )
  args = parser.parse_args()
  main(args.img_path,args.prompt,args.steps,args.guidance)
