import { useState } from "react";
import { ParticleBackground, Loader } from "./ParticleBackground";
import type { CSSProperties, FormEvent } from "react";

type LoginData = { email: string; password: string };
type RegisterData = LoginData & { name: string };

type CubeProps = {
  size: number;
  labels: string[];
  style?: CSSProperties;
  duration?: number;
};

type AuthCard3DProps = {
  onLogin?: (data: LoginData) => void;
  onRegister?: (data: RegisterData) => void;
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap');
.auth-scene{position:relative;min-height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center;perspective:1300px;font-family:'Space Grotesk',system-ui,sans-serif;background:radial-gradient(ellipse at 30% 20%,#2b2370 0%,#0e0c22 60%,#07061a 100%)}
.auth-card{position:relative;width:390px;max-width:92vw;height:560px;transform-style:preserve-3d;border-radius:28px;box-shadow:0 60px 80px -30px rgba(0,0,0,.7);transition:transform .9s cubic-bezier(.6,-.1,.3,1.1)}
.auth-face{position:absolute;inset:0;box-sizing:border-box;padding:36px 34px;border-radius:28px;backface-visibility:hidden;display:flex;flex-direction:column;gap:14px;color:#f4f2ff;background:linear-gradient(160deg,#241f4d,#16142e);border:1px solid rgba(255,255,255,.14);transition:visibility 0s linear .45s}
.auth-face h1{margin:0;font-size:34px;line-height:1.1}
.auth-face p{margin:0 0 4px;color:#c9c4f2;font-size:15px}
.auth-tag{font-family:'JetBrains Mono',monospace;font-size:13px;color:#7dffb2}
.auth-tag b{color:#ff8fb8}
.auth-lbl{font-family:'JetBrains Mono',monospace;font-size:13px;color:#c9c4f2}
.auth-inp{width:100%;box-sizing:border-box;height:46px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(8,7,24,.6);color:#fff;padding:0 14px;font:inherit;font-size:15px;outline:none}
.auth-inp:focus{border-color:#ff8fb8;box-shadow:0 0 0 3px rgba(255,143,184,.3)}
.auth-btn{margin-top:10px;height:50px;border:0;border-radius:14px;font:inherit;font-weight:700;font-size:16px;color:#fff;background:#6d4aff;cursor:pointer;box-shadow:0 8px 0 #4528c4,0 18px 30px rgba(109,74,255,.4);transition:transform .15s,box-shadow .15s}
.auth-btn:hover{transform:translateY(2px);box-shadow:0 6px 0 #4528c4,0 14px 24px rgba(109,74,255,.4)}
.auth-btn:active{transform:translateY(8px);box-shadow:0 0 0 #4528c4}
.auth-switch{margin-top:auto;display:flex;justify-content:center;align-items:center;gap:8px;font-size:14px;color:#c9c4f2}
.auth-link{background:none;border:0;padding:0;min-height:44px;font:inherit;font-weight:700;color:#ffb3cf;text-decoration:underline;cursor:pointer}
.auth-float{position:absolute;transform-style:preserve-3d;animation:auth-bob 6s ease-in-out infinite}
.auth-cube{position:absolute;inset:0;transform-style:preserve-3d;animation:auth-spin 18s linear infinite}
.auth-cube div{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:1px solid rgba(125,255,178,.45);background:rgba(125,92,255,.2);font:700 16px 'JetBrains Mono',monospace;color:#7dffb2}
.auth-cube div:nth-child(1){transform:translateZ(var(--h))}
.auth-cube div:nth-child(2){transform:rotateY(180deg) translateZ(var(--h))}
.auth-cube div:nth-child(3){transform:rotateY(90deg) translateZ(var(--h))}
.auth-cube div:nth-child(4){transform:rotateY(-90deg) translateZ(var(--h))}
.auth-cube div:nth-child(5){transform:rotateX(90deg) translateZ(var(--h))}
.auth-cube div:nth-child(6){transform:rotateX(-90deg) translateZ(var(--h))}
@keyframes auth-spin{from{transform:rotateX(20deg) rotateY(0)}to{transform:rotateX(380deg) rotateY(360deg)}}
@keyframes auth-bob{0%,100%{translate:0 0}50%{translate:0 -18px}}
@media (prefers-reduced-motion:reduce){.auth-cube,.auth-float{animation:none}.auth-card{transition:none}}
`;

function Cube({ size, labels, style, duration = 18 }: CubeProps) {
  return (
    <div className="auth-float" aria-hidden="true" style={{ width: size, height: size, ...style }}>
      <div
        className="auth-cube"
        style={{ "--h": `${size / 2}px`, animationDuration: `${duration}s` } as CSSProperties}
      >
        {labels.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

export default function AuthCard3D({ onLogin, onRegister }: AuthCard3DProps) {
  const [signup, setSignup] = useState(false);
  const [ready, setReady] = useState(false);
  const [login, setLogin] = useState<LoginData>({ email: "", password: "" });
  const [reg, setReg] = useState<RegisterData>({ name: "", email: "", password: "" });

  const submitLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin?.(login);
  };
  const submitReg = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRegister?.(reg);
  };
  return (
    <div className="auth-scene">
      <style>{css}</style>

<ParticleBackground shape={signup ? 1 : 0} />
{!ready && <Loader onDone={() => setReady(true)} />}


      <Cube size={90} labels={["O(n)", "{ }", "01", "</>", "[ ]", "∑"]} style={{ left: "11%", top: "12%" }} />
      <Cube size={120} duration={24} labels={["log n", "n²", "∞", "DFS", "BFS", "DP"]} style={{ right: "12%", bottom: "12%", animationDuration: "8s" }} />
      <Cube size={50} duration={12} labels={[]} style={{ right: "18%", top: "10%", animationDuration: "5s" }} />

      <div className="auth-card" style={{
  transform: `rotateX(-5deg) rotateY(${signup ? 180 : 0}deg)`,
  zIndex: 1,
  opacity: ready ? 1 : 0,
  transition: "transform .9s cubic-bezier(.6,-.1,.3,1.1), opacity .8s",
}}>
        <form className="auth-face" onSubmit={submitLogin} style={{ visibility: signup ? "hidden" : "visible" }}>
          <div className="auth-tag"><b>$</b> algo login --user</div>
          <h1>Bon retour, codeur</h1>
          <p>Reprenez vos défis d'algo là où vous les avez laissés.</p>
          <label className="auth-lbl" htmlFor="l-mail">E-mail</label>
          <input className="auth-inp" id="l-mail" type="email" autoComplete="email" required
            value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
          <label className="auth-lbl" htmlFor="l-pass">Mot de passe</label>
          <input className="auth-inp" id="l-pass" type="password" autoComplete="current-password" required
            value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          <button className="auth-btn" type="submit">Lancer la connexion ▶</button>
          <div className="auth-switch">
            Pas encore de compte ?
            <button type="button" className="auth-link" onClick={() => setSignup(true)}>Créer un compte</button>
          </div>
        </form>

        <form className="auth-face" onSubmit={submitReg} style={{ transform: "rotateY(180deg)", visibility: signup ? "visible" : "hidden" }}>
          <div className="auth-tag"><b>$</b> algo register --new</div>
          <h1>Rejoignez-nous</h1>
          <p>Résolvez, optimisez, grimpez au classement.</p>
          <label className="auth-lbl" htmlFor="s-name">Nom complet</label>
          <input className="auth-inp" id="s-name" type="text" autoComplete="name" required
            value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} />
          <label className="auth-lbl" htmlFor="s-mail">E-mail</label>
          <input className="auth-inp" id="s-mail" type="email" autoComplete="email" required
            value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
          <label className="auth-lbl" htmlFor="s-pass">Mot de passe</label>
          <input className="auth-inp" id="s-pass" type="password" autoComplete="new-password" required minLength={8}
            value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
          <button className="auth-btn" type="submit">Compiler mon compte ▶</button>
          <div className="auth-switch">
            Déjà inscrit ?
            <button type="button" className="auth-link" onClick={() => setSignup(false)}>Se connecter</button>
          </div>
        </form>
      </div>
    </div>
  );
}