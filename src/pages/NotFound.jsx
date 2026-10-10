import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{textAlign:'center', padding: 48}}>
      <h1>404</h1>
      <p style={{color:'var(--muted)'}}>Page not found.</p>
      <Link to="/" style={{color:'var(--accent)'}}>Go home</Link>
    </div>
  );
}
