import subprocess, sys, json
res = subprocess.run(["curl", "-s", "http://localhost:8000/tmdb/movie/550/videos?api_key=demo"], capture_output=True, text=True)
d = json.loads(res.stdout)
print("Results:", len(d.get("results",[])))
for v in d.get("results",[]):
    if v.get("site") == "YouTube":
        print("  ", v.get("type"), v.get("key"))
