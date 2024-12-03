import torch
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
import PIL

model_id = "timbrooks/instruct-pix2pix"
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id, cache_dir ="./model" ,torch_dtype=torch.float16, safety_checker=None)
pipe.to("mps")
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
# `image` is an RGB PIL.Image
image = PIL.Image.open("/Users/haoyishi/Projects/fusionViz/img_data/input/image2.jpg")
pipe.enable_attention_slicing()

images = pipe("turn him into cyborg", image=image).images
images[0].save("./result.png")