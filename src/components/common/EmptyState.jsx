export default function EmptyState({ message = 'No items found.', action }) {
  return <div style={{padding:32, textAlign:'center', color:'var(--muted)'}}>
    <p>{message}</p>
    {action ? <div style={{marginTop:8}}>{action}</div> : null}
  </div>;
}
