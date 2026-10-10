#!/usr/bin/env python3
import http.client, urllib.parse, os, ssl
from http.server import HTTPServer, BaseHTTPRequestHandler

TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8'

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        params['api_key'] = [TMDB_KEY]
        query = urllib.parse.urlencode(params, doseq=True)
        path = parsed.path.replace('/tmdb', '')
        conn = http.client.HTTPSConnection('api.themoviedb.org')
        conn.request('GET', f"/3{path}?{query}")
        resp = conn.getresponse()
        body = resp.read()
        self.send_response(resp.status)
        for h, v in resp.getheaders():
            if h.lower() not in ('transfer-encoding', 'content-encoding', 'connection'):
                self.send_header(h, v)
        self.end_headers()
        self.wfile.write(body)
        conn.close()
    def log_message(self, fmt, *args): pass

if __name__ == '__main__':
    HTTPServer(('0.0.0.0', 8000), Handler).serve_forever()
