from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware  # 1. Import the middleware
from rembg import remove, new_session
from PIL import Image
import io

app = FastAPI()

# 2. Add the CORS configuration right after initializing the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Allows your Live Server origin
    allow_credentials=True,
    allow_methods=["*"],                      # Allows POST, GET, etc.
    allow_headers=["*"],                      # Allows all headers
)

human_session = new_session("u2net_human_seg")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    output = remove(image, session=human_session)

    buffer = io.BytesIO()
    output.save(buffer, format="PNG")
    buffer.seek(0)

    return Response(content=buffer.getvalue(), media_type="image.png")