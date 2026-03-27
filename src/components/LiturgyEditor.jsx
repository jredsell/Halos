import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Type, Save, Plus, Trash2, FileText, ChevronRight,
  MessageSquare, MessageCircle, Eye, Edit3
} from 'lucide-react';
import { parseLiturgyMarkdown, buildLiturgyMarkdown } from '../utils/liturgyParser';
import ConfirmModal from './ConfirmModal';

// ─── Toolbar Button ────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, title, children, active, variant = 'default' }) {
  const base = 'p-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider select-none';
  const variants = {
    default: active
      ? 'bg-neutral-700 text-white shadow-inner'
      : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
    speaker: active
      ? 'bg-white/20 text-white shadow-inner border border-white/30'
      : 'text-white/60 hover:text-white hover:bg-white/10 border border-white/10',
    response: active
      ? 'bg-amber-500/30 text-amber-300 shadow-inner border border-amber-500/40'
      : 'text-amber-500/60 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/10',
  };
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

// ─── Mini Preview of a Liturgy Slide ──────────────────────────────────────
function LiturgyPreviewSlide({ slide, isActive, onClick }) {
  const isResponse = slide.type === 'response';
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
        isActive
          ? isResponse
            ? 'bg-amber-950/40 border-amber-500/50 shadow-[inset_0_0_12px_rgba(245,158,11,0.1)]'
            : 'bg-neutral-700/70 border-neutral-500/50'
          : 'bg-neutral-900/60 border-neutral-800/60 hover:border-neutral-700'
      }`}
    >
      <div className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isResponse ? 'text-amber-400' : 'text-neutral-400'}`}>
        {isResponse ? '↩ Response' : '› Speaker'}
      </div>
      {slide.content.map((line, i) => (
        <div
          key={i}
          className={`text-xs font-medium leading-relaxed truncate ${isResponse ? 'text-amber-200/80' : 'text-neutral-300'}`}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

// ─── Main LiturgyEditor ───────────────────────────────────────────────────
export default function LiturgyEditor({ 
  libraryHandle, 
  initialFile = null,    // { name, handle } — null = new file
  onSaved,
  onDeleted,
  onRefresh,
}) {
  const [title, setTitle]     = useState('');
  const [body, setBody]       = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef(null);

  // Load file if editing
  useEffect(() => {
    if (initialFile) {
      const load = async () => {
        try {
          const file = await initialFile.handle.getFile();
          const text = await file.text();
          const parsed = parseLiturgyMarkdown(text);
          setTitle(parsed.metadata.title || initialFile.name.replace('.md', ''));
          // Rebuild body (strip frontmatter)
          const bodyOnly = text.replace(/^---\n[\s\S]*?\n---\n*/m, '').trim();
          setBody(bodyOnly);
        } catch (err) {
          console.error('Failed to load liturgy file', err);
        }
      };
      load();
    } else {
      setTitle('');
      setBody('');
    }
    setIsDirty(false);
  }, [initialFile]);

  const slides = parseLiturgyMarkdown(buildLiturgyMarkdown(title || 'Untitled', body)).slides;

  // ── Text Insertion Helpers ──────────────────────────────────────────────
  const insertAtCursor = useCallback((before, after = '', defaultText = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end) || defaultText;
    const newVal = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    setBody(newVal);
    setIsDirty(true);
    // Restore cursor
    requestAnimationFrame(() => {
      ta.focus();
      const newCursorPos = start + before.length + selected.length + after.length;
      ta.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, []);

  const insertLineTag = useCallback((tag) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
    const insert = `\n${tag}\n`;
    const newVal = ta.value.slice(0, lineStart) + insert + ta.value.slice(lineStart);
    setBody(newVal);
    setIsDirty(true);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = lineStart + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }, []);

  const insertListItem = useCallback((prefix) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const before = ta.value.slice(0, start);
    const needsNewline = before.length > 0 && !before.endsWith('\n');
    const insert = (needsNewline ? '\n' : '') + prefix + ' ';
    const newVal = ta.value.slice(0, start) + insert + ta.value.slice(start);
    setBody(newVal);
    setIsDirty(true);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!libraryHandle) return;
    const safeTitle = (title || 'Untitled').trim();
    const filename = safeTitle.replace(/[^a-z0-9\s\-_]/gi, '').replace(/\s+/g, '_') + '.md';
    try {
      setIsSaving(true);
      const dir = await libraryHandle.getDirectoryHandle('Liturgy', { create: true });
      
      // If renaming, remove old file
      if (initialFile && initialFile.name !== filename) {
        try { await dir.removeEntry(initialFile.name); } catch {}
      }

      const fileHandle = await dir.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(buildLiturgyMarkdown(safeTitle, body));
      await writable.close();
      setIsDirty(false);
      if (onSaved) onSaved({ name: filename, handle: fileHandle });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!libraryHandle || !initialFile) return;
    try {
      const dir = await libraryHandle.getDirectoryHandle('Liturgy', { create: false });
      await dir.removeEntry(initialFile.name);
      setShowDeleteConfirm(false);
      if (onDeleted) onDeleted(initialFile.name);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Delete failed: ' + err.message);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-0 overflow-hidden">

      {/* ── Top Bar ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-800/60 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Liturgy Title..."
            value={title}
            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
            className="w-full bg-transparent text-white font-extrabold text-xl tracking-wide outline-none placeholder-neutral-600 border-b border-transparent focus:border-neutral-600 transition pb-1"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowPreview(v => !v)}
            className={`p-2 rounded-lg transition text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
              showPreview
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                : 'text-neutral-400 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            {showPreview ? <Edit3 size={14} /> : <Eye size={14} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          {initialFile && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg transition text-neutral-500 hover:text-red-400 hover:bg-red-500/10 border border-neutral-800"
              title="Delete this file"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/20 shadow-lg transition"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : isDirty ? 'Save*' : 'Saved'}
          </button>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      {!showPreview && (
        <div className="flex items-center gap-1 py-3 border-b border-neutral-800/40 flex-shrink-0 flex-wrap">
          {/* Text formatting */}
          <div className="flex items-center gap-1 pr-3 border-r border-neutral-800">
            <ToolbarBtn onClick={() => insertAtCursor('**', '**', 'bold text')} title="Bold">
              <Bold size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertAtCursor('*', '*', 'italic text')} title="Italic">
              <Italic size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertAtCursor('<u>', '</u>', 'underlined text')} title="Underline">
              <Underline size={14} />
            </ToolbarBtn>
          </div>

          {/* Headers */}
          <div className="flex items-center gap-1 pr-3 border-r border-neutral-800">
            <ToolbarBtn onClick={() => insertAtCursor('# ', '', 'Heading 1')} title="Heading 1">
              <Type size={14} /><span>H1</span>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertAtCursor('## ', '', 'Heading 2')} title="Heading 2">
              <span className="text-[11px]">H2</span>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertAtCursor('### ', '', 'Heading 3')} title="Heading 3">
              <span className="text-[10px]">H3</span>
            </ToolbarBtn>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-3 border-r border-neutral-800">
            <ToolbarBtn onClick={() => insertListItem('-')} title="Bullet List">
              <List size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => insertListItem('1.')} title="Numbered List">
              <ListOrdered size={14} />
            </ToolbarBtn>
          </div>

          {/* Speaker / Response */}
          <div className="flex items-center gap-1.5 pl-1">
            <ToolbarBtn
              onClick={() => insertLineTag('[/speaker]')}
              title="Insert Speaker block"
              variant="speaker"
            >
              <MessageSquare size={13} />
              <span>Speaker</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => insertLineTag('[/response]')}
              title="Insert Response block"
              variant="response"
            >
              <MessageCircle size={13} />
              <span className="text-amber-300/80">Response</span>
            </ToolbarBtn>
          </div>
        </div>
      )}

      {/* ── Editor / Preview Pane ──────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex gap-4 pt-4">
        {!showPreview ? (
          /* ── Raw Editor ── */
          <div className="flex-1 h-full flex flex-col">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => { setBody(e.target.value); setIsDirty(true); }}
              placeholder={`Type your liturgy here...\n\nUse the toolbar to add [/speaker] and [/response] blocks.\nExample:\n\n[/speaker]\nThe Lord be with you.\n\n[/response]\nAnd also with you.`}
              className="flex-1 w-full bg-neutral-950/60 border border-neutral-800/60 rounded-xl text-sm font-mono text-neutral-200 p-5 outline-none resize-none focus:border-neutral-600 transition custom-scrollbar leading-relaxed placeholder-neutral-700"
              spellCheck={true}
            />
            <div className="text-[10px] text-neutral-600 mt-2 px-1 font-medium">
              Use <span className="text-white/40 font-mono">[/speaker]</span> and <span className="text-amber-500/40 font-mono">[/response]</span> tags to mark who speaks. Each block becomes one slide on the projector.
            </div>
          </div>
        ) : (
          /* ── Preview ── */
          <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
            {slides.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <FileText size={40} className="text-neutral-600 mb-3" />
                <div className="text-neutral-500 font-bold text-sm">No content yet</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">
                  {slides.length} slide{slides.length !== 1 ? 's' : ''} — as they'll appear on the projector
                </div>
                {slides.map((slide, i) => (
                  <LiturgyPreviewSlide key={i} slide={slide} isActive={false} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Slide-by-slide preview strip (only in edit mode) ── */}
        {!showPreview && slides.length > 0 && (
          <div className="w-52 flex-shrink-0 h-full overflow-y-auto custom-scrollbar">
            <div className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-3 px-1">
              {slides.length} Slide{slides.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2">
              {slides.map((slide, i) => (
                <LiturgyPreviewSlide key={i} slide={slide} isActive={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Liturgy File?"
        message={`Are you sure you want to permanently delete "${initialFile?.name?.replace('.md', '')}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete File"
      />
    </div>
  );
}
