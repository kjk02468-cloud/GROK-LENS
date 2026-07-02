/* TEAM JACK1 · LENS/APP 공통 가독성·줄바꿈 (fmt / fmtPMBullets) */
(function(){
  window.OPTIMISM_FRAMING_RULES=`[톤·프레이밍 — 낙관 우선, 분석은 유지]
· 기본 톤은 성장·기회·업사이드 우선. "왜 이 구조가 작동할 수 있는가"를 먼저 쓴다.
· 리스크·반론은 "가설 검증 포인트"로 — 약점 나열·멸망 서사 금지.
· 금지 표현: 파국·멸망·공포·최악·비관·붕괴·역풍(→조정 국면)·약세(→단기 조정).
· 업사이드:검증 분량 ≈ 2:1. 하방만 길게 쓰지 말 것.
· 조정·하락 국면도 기회 프레이밍(좋은 가격·재진입)을 열어두라.`;

  window.READABILITY_RULES=`[가독성·줄바꿈 — 최우선. 모든 사용자-facing 출력]
· 한 줄 최대 40~44자(한글). 넘으면 · / , / — / → 앞에서 줄바꿈.
· "라벨: 내용"·"라벨 | 내용" — 라벨 1줄, 내용은 다음 줄(세로 배치). 한 줄에 라벨+장문 금지.
· 불릿·번호 — 항목마다 한 줄. 항목 사이 빈 줄.
· 2문장 이상 — 마침표 뒤 줄바꿈(다음 문장 새 줄).
· 3개 이상 나열 — 쉼표로 한 줄에 몰아쓰기 금지. 세로 불릿.
· 종목명·단계·숫자 — 첫 줄, 설명은 다음 줄.`;

  function rdEscDefault(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  window.rdEsc=window.rdEsc||rdEscDefault;

  window.hardWrapReadable=function(s,max){
    const out=[];
    let rest=String(s||'').trim();
    while(rest.length>max){
      let cut=-1;
      for(const ch of ['·','，',',','—','/','→',' ']){
        const i=rest.lastIndexOf(ch,max);
        if(i>=12){cut=i+(ch===' '||ch==='→'?1:1);break;}
      }
      if(cut<12)cut=max;
      out.push(rest.slice(0,cut).trim());
      rest=rest.slice(cut).trim();
    }
    if(rest)out.push(rest);
    return out;
  };

  window.fmtProseBody=function(s,maxLen,escFn){
    maxLen=maxLen||44;
    const esc=escFn||window.rdEsc;
    let t=String(s||'').replace(/\r/g,'').trim();
    if(!t)return '';
    if(t.length<=maxLen)return esc(t);
    const lines=[];
    t.split('\n').forEach(function(raw){
      const line=raw.trim();
      if(!line)return;
      if(line.length<=maxLen){lines.push(esc(line));return;}
      const segs=line.split(/(?<=[·•,/—])\s*/).filter(Boolean);
      const chunks=segs.length?segs:[line];
      chunks.forEach(function(seg){
        window.hardWrapReadable(seg,maxLen).forEach(function(p){lines.push(esc(p));});
      });
    });
    return lines.join('<br>');
  };

  window.fmtReadable=function(txt,opts){
    opts=opts||{};
    const esc=opts.esc||window.rdEsc;
    const labelColor=opts.labelColor||'#10b981';
    const bodyColor=opts.bodyColor||'#cbd5e1';
    const maxLen=opts.maxLen||44;
    const prep=opts.prep||function(t){return t;};
    const raw=prep(txt||'');
    if(!raw)return '';
    return raw.split('\n').map(function(l){return l.trim();}).filter(Boolean).map(function(l){
      l=l.replace(/^[\-•▶]\s*/,'');
      const m=l.match(/^([^:：|]{2,22})[:：|]\s*(.+)$/);
      if(m){
        const label=m[1].trim();
        const body=window.fmtProseBody(m[2].trim(),maxLen,esc);
        return '<div class="rd-row" style="margin-bottom:12px;line-height:1.65">'
          +'<div class="rd-label" style="color:'+labelColor+';font-size:11px;font-weight:700;margin-bottom:4px;letter-spacing:.02em">'+esc(label)+'</div>'
          +'<div class="rd-body" style="color:'+bodyColor+';font-size:13px;line-height:1.72">'+body+'</div></div>';
      }
      return '<div class="rd-line" style="margin-bottom:8px;line-height:1.72;color:'+bodyColor+';font-size:13px">'
        +window.fmtProseBody(l,maxLen,esc)+'</div>';
    }).join('');
  };
})();