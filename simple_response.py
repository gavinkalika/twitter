from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def return_data():
    # Replace this with the JSON data you want to return
    return jsonify({"message": "Hello, world!", "status": "success"})

if __name__ == '__main__':
    app.run(port=8080)