from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
import optimizer

def create_app():
	app = Flask(__name__)
	return app

app = create_app()
api = Api(app)
CORS(app)

class portfolio(Resource):
    def get(self):
        #ticker_list = "FB GOOGL"
        data = dict()
        if request.args.get("tickers") and len(request.args.get("tickers").split()) >= 2:
            ticker_list = request.args.get("tickers")
            app.logger.info(ticker_list.split())
            minRisk, maxReturn, df = optimizer.optimize(ticker_list)
            data["minRisk"] = minRisk
            data["maxReturn"] = maxReturn
            data["df"] = df.to_json(orient='split')
        else:
            data["Error"] = "No portfolio provided"
        app.logger.info(data)
        return data

api.add_resource(portfolio, '/api/portfolio')

@app.route('/')
def index():
    return """<h2 style='color:red;background-color:blue'>Portfolio Optimizer Rest API using Flask</h2>
    <p>Pass ticker symbols to tickers variable in URL string e.g. :</p>
    <a href='/api/portfolio?tickers=FB GOOGL'>View Min Risk and Max Return Portfolios for FB and GOOGL</a>"""

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8090)
