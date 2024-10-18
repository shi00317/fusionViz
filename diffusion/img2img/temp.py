import PIL
import requests
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
torch.manual_seed(1234)
model_id = "timbrooks/instruct-pix2pix"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id,cache_dir="./model", torch_dtype=torch.float32, safety_checker=None)
pipe = pipe.to("mps")
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
pipe.enable_attention_slicing()

url = "https://raw.githubusercontent.com/timothybrooks/instruct-pix2pix/main/imgs/example.jpg"
def download_image(url):
    image = PIL.Image.open(requests.get(url, stream=True).raw)
    image = PIL.ImageOps.exif_transpose(image)
    image = image.convert("RGB")
    return image
def input_preprocessing(path):
    image = PIL.Image.open(path)
    image = PIL.ImageOps.exif_transpose(image)
    image = image.convert("RGB")
    return image

# image = input_preprocessing("1copy.jpg")
image = input_preprocessing("test.jpg")
# image = download_image(url)

prompt = "A fusion of this images" #, need to use both logo and create new image. where the first logo is in the middle and the second logo is on the bottom right. output should be no boundry and be realistic and both logo are same important."
# prompt = "Create a new image by fusing all the characters, icons, and features from the input image. Blend these elements seamlessly into a single cohesive composition, ensuring that all key components from the original image are integrated and visually harmonious in the final output."
# prompt = "Create a new image by seamlessly fusing all the characters, icons, and features from the input image. Remove any boundaries between the elements while keeping the original colors of each character intact. Blend everything naturally into a cohesive composition where all components are smoothly integrated but maintain their distinct color palettes."

images = pipe(prompt, image=image, num_inference_steps=10, image_guidance_scale=1).images
images[0].save("output.png")

