import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
import argparse
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

def main(img_path,prompt,steps,guidance):
    image = input_preprocessing(img_path)

    images = pipe(prompt, image=image, num_inference_steps=steps,guidance_scale=guidance, image_guidance_scale=1.1).images
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
