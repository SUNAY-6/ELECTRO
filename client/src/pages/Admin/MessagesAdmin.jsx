import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.messages());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader label="FETCHING PACKETS…" />;

  return (
    <div>
      <p className="tech-label text-cyan">INBOX</p>
      <h1 className="font-display text-3xl">Messages</h1>
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="NO INCOMING PACKETS" body="Contact form transmissions will land here." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((m) => (
            <article key={m.id} className={`glass rounded-sm p-4 ${m.read ? 'opacity-70' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{m.subject}</p>
                  <p className="text-xs text-mute">
                    {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!m.read && (
                    <button type="button" onClick={async () => { await api.readMessage(m.id); load(); }} className="border border-line px-3 py-1 font-mono text-[10px]">
                      MARK READ
                    </button>
                  )}
                  <button type="button" onClick={async () => { await api.deleteMessage(m.id); load(); }} className="border border-danger/40 px-3 py-1 font-mono text-[10px] text-danger">
                    DELETE
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-mute">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
