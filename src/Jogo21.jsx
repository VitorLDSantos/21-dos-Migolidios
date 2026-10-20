import { useState } from "react";

const sortear = () => Math.floor(Math.random() * 10) + 1; // 1 a 10

function situacao(p) {
  if (p > 21) return "estourou";
  if (p === 21) return "vinte-e-um";
  if (p >= 17) return "perto";
  return "normal";
}

const MENSAGENS = {
  normal: "Pegue mais bananas!",
  perto: "Perto do 21, cuidado!",
  "vinte-e-um": "21! Banana perfeita!",
  estourou: "Passou de 21!",
};

const MACACOS = { normal: "🐒", perto: "🙉", "vinte-e-um": "🐵", estourou: "🙈" };

function Lado({ nome, pontos, ultima, rodada, onPegar }) {
  const s = situacao(pontos);
  const fim = pontos >= 21;
  return (
    <section className="lado">
      <div className={`painel ${s}`}>
        <h2 className="nome">{nome}</h2>
        <div key={rodada} className="macaco" role="img" aria-label="Macaco">
          {MACACOS[s]}
        </div>
        <div className={`numero ${s}`} aria-live="polite">{pontos}</div>
        <div className="ultima" key={`u${rodada}`}>{ultima ? `+${ultima}` : "\u00A0"}</div>
        <p className="msg">{MENSAGENS[s]}</p>
        <button className="botao" onClick={onPegar} disabled={fim}>
          Pegar banana 🍌
        </button>
      </div>
    </section>
  );
}

export default function Jogo21() {
  const [pontos, setPontos] = useState([0, 0]);
  const [ultima, setUltima] = useState([0, 0]);
  const [rodada, setRodada] = useState([0, 0]);

  const pegar = (i) => {
    const n = sortear();
    setPontos((p) => p.map((v, j) => (j === i ? v + n : v)));
    setUltima((u) => u.map((v, j) => (j === i ? n : v)));
    setRodada((r) => r.map((v, j) => (j === i ? v + 1 : v)));
  };

  const reiniciar = () => {
    setPontos([0, 0]);
    setUltima([0, 0]);
    setRodada([0, 0]);
  };

  return (
    <div className="tela">
      <style>{`
        .tela {
          position: relative; min-height: 100vh; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          background: linear-gradient(#e8590c 0%, #f4a340 45%, #fbd98b 75%);
          font-family: "Trebuchet MS", "Segoe UI", sans-serif; color: #fff3d6;
        }
        .cena { position: absolute; inset: 0; width: 100%; height: 100%; }
        .divisor {
          position: absolute; top: 0; bottom: 0; left: 50%; width: 10px; margin-left: -5px;
          background: repeating-linear-gradient(#4e2f14 0 22px, #6b4120 22px 26px);
          box-shadow: 0 0 0 3px rgba(0,0,0,.18); z-index: 2;
        }
        .lado { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; padding: 12px; }
        .painel {
          width: min(340px, 100%); text-align: center; box-sizing: border-box;
          background: #7a4a21; border: 6px solid #4e2f14; border-radius: 20px;
          padding: 16px 14px 22px; box-shadow: 0 8px 0 #4e2f14;
          transition: box-shadow .25s;
        }
        .painel.vinte-e-um { box-shadow: 0 8px 0 #4e2f14, 0 0 38px 8px rgba(74, 222, 128, .75); }
        .painel.estourou { box-shadow: 0 8px 0 #4e2f14, 0 0 28px 4px rgba(255, 90, 77, .55); }
        .nome { margin: 0; font-size: clamp(16px, 3.4vw, 24px); }
        .macaco { font-size: clamp(44px, 9vw, 72px); display: inline-block; animation: pular .45s ease-out; }
        @keyframes pular {
          0% { transform: translateY(0) rotate(0); }
          40% { transform: translateY(-24px) rotate(-10deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        .numero { font-size: clamp(60px, 13vw, 104px); font-weight: 800; line-height: 1; transition: color .25s; }
        .numero.normal { color: #fff3d6; }
        .numero.perto { color: #ffd23f; }
        .numero.vinte-e-um { color: #4ade80; animation: brilho 1.1s ease-in-out infinite alternate; }
        .numero.estourou { color: #ff5a4d; }
        @keyframes brilho {
          from { text-shadow: 0 0 8px #4ade80, 0 0 18px #22c55e; }
          to { text-shadow: 0 0 22px #86efac, 0 0 46px #22c55e; }
        }
        .ultima { height: 26px; font-size: 20px; font-weight: 700; color: #ffd23f; animation: surgir .4s ease-out; }
        @keyframes surgir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .msg { margin: 4px 0 14px; font-size: clamp(12px, 2.6vw, 15px); min-height: 20px; }
        .botao {
          width: 100%; border: none; border-radius: 14px; padding: 12px 8px;
          font-size: clamp(13px, 2.8vw, 17px); font-weight: 700; cursor: pointer;
          background: #ffd23f; color: #3b2a1a;
          box-shadow: 0 5px 0 rgba(0,0,0,.35); transition: transform .08s, box-shadow .08s;
        }
        .botao:active:not(:disabled) { transform: translateY(4px); box-shadow: 0 1px 0 rgba(0,0,0,.35); }
        .botao:disabled { background: #b9a47a; cursor: not-allowed; }
        .botao:focus-visible, .reiniciar:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .reiniciar {
          position: absolute; z-index: 3; left: 50%; bottom: 18px; transform: translateX(-50%);
          border: 4px solid #4e2f14; border-radius: 999px; padding: 8px 18px;
          background: #e9c9a0; color: #3b2a1a; font-weight: 700; font-size: 15px; cursor: pointer;
        }
        @media (prefers-reduced-motion: reduce) {
          .macaco, .numero.vinte-e-um, .ultima { animation: none; }
        }
      `}</style>

      <svg className="cena" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="400" cy="380" r="100" fill="#fff1c1" opacity=".85" />
        <path d="M0 470 Q200 410 400 460 T800 440 V600 H0Z" fill="#b5651d" />
        <path d="M0 520 Q250 470 480 515 T800 500 V600 H0Z" fill="#8a5a2b" />
        <g fill="#3b2a1a">
          <rect x="68" y="390" width="10" height="120" />
          <ellipse cx="73" cy="385" rx="80" ry="18" />
          <rect x="730" y="410" width="8" height="100" />
          <ellipse cx="734" cy="405" rx="62" ry="15" />
        </g>
        <g stroke="#c9a227" strokeWidth="3" strokeLinecap="round">
          <path d="M150 560 l-6 -26 M162 560 l4 -30 M174 560 l10 -24" />
          <path d="M620 570 l-6 -26 M632 570 l4 -30 M644 570 l10 -24" />
        </g>
      </svg>

      <div className="divisor" aria-hidden="true" />

      <Lado nome="Jogador 1" pontos={pontos[0]} ultima={ultima[0]} rodada={rodada[0]} onPegar={() => pegar(0)} />
      <Lado nome="Jogador 2" pontos={pontos[1]} ultima={ultima[1]} rodada={rodada[1]} onPegar={() => pegar(1)} />

      <button className="reiniciar" onClick={reiniciar}>Reiniciar</button>
    </div>
  );
}
