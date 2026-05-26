import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarClock, FileText, ImagePlus, Megaphone, SendHorizonal, Trash2, Video } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { routes } from "@/lib/routes";
import { BusinessPortalPageHeader } from "../components/BusinessPortalPageHeader";
import {
  type BusinessContentMediaKind,
  type BusinessContentStatus,
  type BusinessContentType,
  type BusinessPortalContentItem,
  type BusinessPortalMediaAsset,
} from "../lib/mockBusinessPortal";
import { useBusinessPortalSession } from "../lib/session";

const statusOptions: BusinessContentStatus[] = ["Draft", "Scheduled", "Published", "Archived"];
const typeOptions: BusinessContentType[] = ["Announcement", "Offer", "Event"];
const mediaKindOptions: BusinessContentMediaKind[] = ["Image", "Video"];

type EditorState = {
  id?: string;
  title: string;
  summary: string;
  body: string;
  status: BusinessContentStatus;
  type: BusinessContentType;
  ctaLabel: string;
  ctaUrl: string;
  publishAt: string;
  attachments: BusinessPortalMediaAsset[];
};

const emptyEditor: EditorState = {
  title: "",
  summary: "",
  body: "",
  status: "Draft",
  type: "Announcement",
  ctaLabel: "",
  ctaUrl: "",
  publishAt: "",
  attachments: [],
};

function formatDateTimeLocal(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toEditorState(item: BusinessPortalContentItem): EditorState {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    body: item.body,
    status: item.status,
    type: item.type,
    ctaLabel: item.ctaLabel,
    ctaUrl: item.ctaUrl,
    publishAt: item.publishAt,
    attachments: item.attachments,
  };
}

export function BusinessPortalContentPage() {
  const { content, currentRole, permissions, saveContentItem } = useBusinessPortalSession();
  const [selectedId, setSelectedId] = useState<string | null>(content[0]?.id ?? null);
  const [editorState, setEditorState] = useState<EditorState>(content[0] ? toEditorState(content[0]) : emptyEditor);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedId === null) {
      setEditorState((current) => (current.id ? emptyEditor : current));
      return;
    }

    const selectedItem = content.find((item) => item.id === selectedId) ?? null;

    if (!selectedItem) {
      setSelectedId(content[0]?.id ?? null);
      setEditorState(content[0] ? toEditorState(content[0]) : emptyEditor);
      return;
    }

    setEditorState(toEditorState(selectedItem));
  }, [content, selectedId]);

  const summary = useMemo(
    () => ({
      drafts: content.filter((item) => item.status === "Draft").length,
      scheduled: content.filter((item) => item.status === "Scheduled").length,
      published: content.filter((item) => item.status === "Published").length,
      archived: content.filter((item) => item.status === "Archived").length,
    }),
    [content],
  );

  function updateField<K extends keyof EditorState>(field: K, value: EditorState[K]) {
    setEditorState((current) => ({ ...current, [field]: value }));
  }

  function startNewDraft() {
    setSelectedId(null);
    setEditorState(emptyEditor);
    setMessage("");
    setErrorMessage("");
  }

  function addAttachment() {
    setEditorState((current) => ({
      ...current,
      attachments: [
        ...current.attachments,
        {
          id: `attachment-${Date.now()}`,
          label: "",
          kind: "Image",
          url: "",
          altText: "",
        },
      ],
    }));
  }

  function updateAttachment(id: string, patch: Partial<BusinessPortalMediaAsset>) {
    setEditorState((current) => ({
      ...current,
      attachments: current.attachments.map((attachment) =>
        attachment.id === id ? { ...attachment, ...patch } : attachment,
      ),
    }));
  }

  function removeAttachment(id: string) {
    setEditorState((current) => ({
      ...current,
      attachments: current.attachments.filter((attachment) => attachment.id !== id),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!permissions.canManageContent) {
      setErrorMessage("Your current role can view content, but cannot create or publish it.");
      return;
    }

    if (!editorState.title.trim() || !editorState.body.trim()) {
      setErrorMessage("Title and body are required.");
      return;
    }

    if (editorState.status === "Scheduled" && !editorState.publishAt) {
      setErrorMessage("Choose a publish time before scheduling this post.");
      return;
    }

    if (editorState.attachments.some((attachment) => attachment.url.trim().length === 0)) {
      setErrorMessage("Every media attachment needs a valid URL.");
      return;
    }

    setIsSaving(true);

    try {
      await saveContentItem({
        ...editorState,
        title: editorState.title.trim(),
        summary: editorState.summary.trim(),
        body: editorState.body.trim(),
        ctaLabel: editorState.ctaLabel.trim(),
        ctaUrl: editorState.ctaUrl.trim(),
        attachments: editorState.attachments.map((attachment) => ({
          ...attachment,
          label: attachment.label.trim(),
          url: attachment.url.trim(),
          altText: attachment.altText.trim(),
        })),
      });
      setMessage(
        editorState.status === "Published"
          ? "Content published."
          : editorState.status === "Scheduled"
            ? "Content scheduled."
            : "Content saved.",
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while saving content.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <BusinessPortalPageHeader
        eyebrow="Content studio"
        title="Draft, schedule, and publish business content."
        description="Plan announcements, offers, and events from one place, then attach the media needed to launch them confidently."
        aside={
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
            {permissions.canManageContent ? "Create + publish access" : "Read only"}
          </div>
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="grid content-start gap-5">
          <div className="grid items-start gap-5 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              { label: "Drafts", value: String(summary.drafts) },
              { label: "Scheduled", value: String(summary.scheduled) },
              { label: "Published", value: String(summary.published) },
              { label: "Archived", value: String(summary.archived) },
            ].map((item) => (
              <GlassCard key={item.label} className="self-start p-6">
                <p className="text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">{item.label}</p>
                <p className="mt-3 font-display text-4xl font-black leading-none text-white">{item.value}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Content queue</p>
                <h3 className="mt-3 font-display text-3xl font-black text-white">Studio lineup</h3>
              </div>
              <Megaphone className="mt-1 h-5 w-5 text-emerald-200" />
            </div>

            {!permissions.canManageContent ? (
              <div className="mt-6 rounded-[1.5rem] border border-amber-300/15 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
                You are signed in as {currentRole ?? "a viewer"}. Content is read-only for your role.
              </div>
            ) : (
              <div className="mt-6">
                <Button onClick={startNewDraft} className="px-5 py-3">
                  New content item
                </Button>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              {content.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-6 text-sm leading-7 text-white/60">
                  No content items yet. Create your first announcement to start filling the studio queue.
                </div>
              ) : null}

              {content.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setEditorState(toEditorState(item));
                    setMessage("");
                    setErrorMessage("");
                  }}
                  className={`rounded-[1.5rem] border p-5 text-left transition ${
                    selectedId === item.id
                      ? "border-emerald-300/25 bg-emerald-500/10"
                      : "border-white/10 bg-black/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/55">{item.updatedAtLabel}</p>
                      <h4 className="mt-1 text-xl font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-white/65">{item.summary || item.body}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75">
                        {item.type}
                      </span>
                      {item.attachments.length > 0 ? (
                        <span className="rounded-full border border-sky-300/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
                          {item.attachments.length} media
                        </span>
                      ) : null}
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Content editor</p>
              <h3 className="mt-3 font-display text-3xl font-black text-white">
                {selectedId ? "Edit selected content" : "Create a new content item"}
              </h3>
            </div>
            <FileText className="mt-1 h-5 w-5 text-emerald-200" />
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">Content type</span>
                <select
                  disabled={!permissions.canManageContent}
                  value={editorState.type}
                  onChange={(event) => updateField("type", event.target.value as BusinessContentType)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-white/70">Status</span>
                <select
                  disabled={!permissions.canManageContent}
                  value={editorState.status}
                  onChange={(event) => updateField("status", event.target.value as BusinessContentStatus)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Title</span>
              <input
                disabled={!permissions.canManageContent}
                value={editorState.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Spring league registration now open"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Summary</span>
              <textarea
                disabled={!permissions.canManageContent}
                value={editorState.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="One-line summary for the queue and future preview cards."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Body</span>
              <textarea
                disabled={!permissions.canManageContent}
                value={editorState.body}
                onChange={(event) => updateField("body", event.target.value)}
                className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write the customer-facing message here."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-white/70">CTA label</span>
                <input
                  disabled={!permissions.canManageContent}
                  value={editorState.ctaLabel}
                  onChange={(event) => updateField("ctaLabel", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Register now"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-white/70">CTA URL</span>
                <input
                  disabled={!permissions.canManageContent}
                  value={editorState.ctaUrl}
                  onChange={(event) => updateField("ctaUrl", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="https://scoutsports.app/offers"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm text-white/70">Publish time</span>
              <input
                disabled={!permissions.canManageContent}
                type="datetime-local"
                value={formatDateTimeLocal(editorState.publishAt)}
                onChange={(event) =>
                  updateField("publishAt", event.target.value ? new Date(event.target.value).toISOString() : "")
                }
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Media attachments</p>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    Add image or video URLs so each post ships with the creative the business actually plans to use.
                  </p>
                </div>
                {permissions.canManageContent ? (
                  <button
                    type="button"
                    onClick={addAttachment}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Add media
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4">
                {editorState.attachments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/50">
                    No media attached yet.
                  </div>
                ) : null}

                {editorState.attachments.map((attachment) => (
                  <div key={attachment.id} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(160px,200px)]">
                          <label className="space-y-2">
                            <span className="text-sm text-white/70">Label</span>
                            <input
                              disabled={!permissions.canManageContent}
                              value={attachment.label}
                              onChange={(event) => updateAttachment(attachment.id, { label: event.target.value })}
                              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Hero graphic"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="text-sm text-white/70">Type</span>
                            <select
                              disabled={!permissions.canManageContent}
                              value={attachment.kind}
                              onChange={(event) =>
                                updateAttachment(attachment.id, { kind: event.target.value as BusinessContentMediaKind })
                              }
                              className="min-w-0 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {mediaKindOptions.map((option) => (
                                <option key={option} value={option} className="bg-slate-950 text-white">
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <label className="space-y-2">
                          <span className="text-sm text-white/70">Media URL</span>
                          <input
                            disabled={!permissions.canManageContent}
                            value={attachment.url}
                            onChange={(event) => updateAttachment(attachment.id, { url: event.target.value })}
                            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="https://..."
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm text-white/70">Alt text</span>
                          <input
                            disabled={!permissions.canManageContent}
                            value={attachment.altText}
                            onChange={(event) => updateAttachment(attachment.id, { altText: event.target.value })}
                            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe what appears in the media."
                          />
                        </label>
                      </div>

                      <div className="grid gap-4">
                        <div className="flex min-h-40 items-center justify-center rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                          {attachment.url ? (
                            attachment.kind === "Image" ? (
                              <img
                                src={attachment.url}
                                alt={attachment.altText || attachment.label || "Content attachment"}
                                className="max-h-44 w-full rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-3 text-center text-white/65">
                                <Video className="h-7 w-7 text-emerald-200" />
                                <p className="text-sm leading-6">Video link attached</p>
                                <p className="break-all text-xs text-white/45">{attachment.url}</p>
                              </div>
                            )
                          ) : (
                            <div className="text-center text-sm leading-6 text-white/45">
                              Paste a media URL to preview it here.
                            </div>
                          )}
                        </div>

                        {permissions.canManageContent ? (
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300/15 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/15"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove media
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-1 h-5 w-5 text-emerald-200" />
                <p className="text-sm leading-7 text-white/65">
                  Use `Draft` while shaping the message, `Scheduled` when a publish time is locked, and `Published`
                  once it should appear live. Archived items stay in the history without cluttering the active queue.
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/50">
                Content is managed in this workspace today. Customer-facing distribution can be connected later without
                changing the business workflow here.
              </p>
            </div>

            {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
            {message ? <p className="text-sm text-emerald-200">{message}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!permissions.canManageContent || isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-glow transition duration-300 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {permissions.canManageContent
                  ? isSaving
                    ? "Saving..."
                    : editorState.status === "Published"
                      ? "Save and publish"
                      : "Save content"
                  : "Content access is read only"}
              </button>
              <Button href={routes.businessPortal} variant="secondary" className="px-6 py-4">
                Back to overview
              </Button>
              {permissions.canManageContent ? (
                <button
                  type="button"
                  onClick={startNewDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <SendHorizonal className="h-4 w-4" />
                  Start another draft
                </button>
              ) : null}
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
