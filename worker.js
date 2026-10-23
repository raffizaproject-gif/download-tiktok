// Cloudflare Worker: proxy gratis untuk Download TT by Vixzaa
// Fungsi: ambil data video (/?url=LINK_TIKTOK) dan teruskan file media (/dl?u=URL_MEDIA) dengan header CORS.
const OK_HOSTS=["tikwm.com","tiktokcdn.com","tiktokcdn-us.com","tiktokv.com","tiktokv.us","byteoversea.com","ibytedtos.com","muscdn.com","akamaized.net"];
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Expose-Headers":"Content-Length,Content-Type","Access-Control-Allow-Headers":"*"};
export default{
  async fetch(req){
    if(req.method==="OPTIONS")return new Response(null,{headers:cors});
    const u=new URL(req.url);
    try{
      if(u.pathname==="/dl"){
        const t=new URL(u.searchParams.get("u")||"");
        if(!OK_HOSTS.some(h=>t.hostname===h||t.hostname.endsWith("."+h)))return new Response("Host tidak diizinkan",{status:403,headers:cors});
        const h=new Headers({"User-Agent":"Mozilla/5.0","Referer":"https://www.tikwm.com/"});
        if(req.headers.get("Range"))h.set("Range",req.headers.get("Range"));
        const r=await fetch(t,{headers:h});
        const o=new Headers(r.headers);Object.entries(cors).forEach(([k,v])=>o.set(k,v));
        return new Response(r.body,{status:r.status,headers:o});
      }
      const link=u.searchParams.get("url");
      if(!link)return new Response('{"code":-1,"msg":"url kosong"}',{status:400,headers:{...cors,"Content-Type":"application/json"}});
      const r=await fetch("https://www.tikwm.com/api/?hd=1&url="+encodeURIComponent(link),{headers:{"User-Agent":"Mozilla/5.0"}});
      return new Response(await r.text(),{headers:{...cors,"Content-Type":"application/json"}});
    }catch(e){
      return new Response(JSON.stringify({code:-1,msg:String(e)}),{status:500,headers:{...cors,"Content-Type":"application/json"}});
    }
  }
};
