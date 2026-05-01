from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

CANDY_TYPES = ["🍒", "🍋", "🍇", "🍬", "🍫"]
BLOCK_TYPES = ["⬛"]
GRID_SIZE = 8

# Generate a random grid for the requested level, include obstacles

def generate_grid(level=1, forever=False):
    blocks = int(level * 1.5) if not forever else 0  # obstacles increase with level
    grid = [[random.choice(CANDY_TYPES) for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    
    # Place some obstacles
    for _ in range(blocks):
        x, y = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)
        grid[x][y] = random.choice(BLOCK_TYPES)
    return grid

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_grid", methods=["GET"])
def get_grid():
    level = int(request.args.get("level", 1))
    forever = request.args.get("forever", "false") == "true"
    grid = generate_grid(level, forever)
    return jsonify({"grid": grid, "level": level})

if __name__ == "__main__":
    app.run(debug=True)
