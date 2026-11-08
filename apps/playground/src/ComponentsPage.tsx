import { type ReactNode, useState } from "react";
import { IconArrowBackUp, IconSettings, IconTrash } from "@tabler/icons-react";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  ChipRow,
  Dialog,
  DialogActions,
  DialogBody,
  EmptyState,
  Field,
  IconButton,
  Input,
  Kbd,
  Notice,
  PageHeader,
  SearchBox,
  SegmentedControl,
  Select,
  Spinner,
  Textarea,
  useToast,
} from "@pluscosmic/ui";
import { playgroundCopy } from "./copy/playground";
import "./playground.css";

const copy = playgroundCopy.components;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pg-section">
      <h2 className="ui-eyebrow">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentsPage() {
  const toast = useToast();
  const [chip, setChip] = useState(0);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <div className="pg-grid">
        <Section title={copy.buttons.title}>
          <div className="ui-actions">
            <Button variant="primary">{copy.buttons.primary}</Button>
            <Button>{copy.buttons.secondary}</Button>
            <Button variant="ghost">{copy.buttons.ghost}</Button>
            <Button variant="danger">{copy.buttons.danger}</Button>
          </div>
          <div className="ui-actions">
            <Button size="sm">{copy.buttons.small}</Button>
            <Button disabled>{copy.buttons.disabled}</Button>
            <IconButton aria-label={copy.buttons.icon}>
              <IconSettings size={16} aria-hidden="true" />
            </IconButton>
          </div>
        </Section>

        <Section title={copy.fields.title}>
          <Field label={copy.fields.name} hint={copy.fields.nameHint}>
            <Input placeholder={copy.fields.namePlaceholder} />
          </Field>
          <Field label={copy.fields.email} error={copy.fields.emailError}>
            <Input type="email" aria-invalid="true" />
          </Field>
          <Field label={copy.fields.kind}>
            <Select
              value={kind}
              onValueChange={setKind}
              options={copy.fields.kinds.map((label) => ({
                label,
                value: label.toLowerCase(),
              }))}
            />
          </Field>
          <Field label={copy.fields.notes}>
            <Textarea />
          </Field>
          <label className="pg-check">
            <Checkbox defaultChecked />
            {copy.fields.remember}
          </label>
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder={copy.fields.search}
          />
        </Section>

        <Section title={copy.tags.title}>
          <ChipRow>
            {copy.tags.chips.map((label, index) => (
              <Chip
                key={label}
                active={chip === index}
                onClick={() => setChip(index)}
              >
                {label}
              </Chip>
            ))}
          </ChipRow>
          <div className="ui-actions">
            <Badge>{copy.tags.neutral}</Badge>
            <Badge tone="accent">{copy.tags.accent}</Badge>
            <Badge tone="danger">{copy.tags.danger}</Badge>
          </div>
        </Section>

        <Section title={copy.segmented.title}>
          <SegmentedControl
            aria-label={copy.segmented.label}
            options={[
              { value: "monthly", label: copy.segmented.monthly },
              { value: "yearly", label: copy.segmented.yearly },
            ]}
            value={period}
            onChange={setPeriod}
          />
        </Section>

        <Section title={copy.notices.title}>
          <Notice tone="neutral" title={copy.notices.neutral.title}>
            {copy.notices.neutral.text}
          </Notice>
          <Notice tone="info" title={copy.notices.info.title}>
            {copy.notices.info.text}
          </Notice>
          <Notice tone="success" title={copy.notices.success.title}>
            {copy.notices.success.text}
          </Notice>
          <Notice
            tone="warning"
            title={copy.notices.warning.title}
            actions={
              <Button size="sm" variant="primary">
                {copy.notices.warning.action}
              </Button>
            }
          >
            {copy.notices.warning.text}
          </Notice>
          <Notice tone="error" title={copy.notices.error.title}>
            {copy.notices.error.text}
          </Notice>
          <Notice compact tone="error">
            {copy.notices.compact}
          </Notice>
        </Section>

        <Section title={copy.dialog.title}>
          <div className="ui-actions">
            <Button onClick={() => setDialogOpen(true)}>
              {copy.dialog.open}
            </Button>
          </div>
          {dialogOpen ? (
            <Dialog
              eyebrow={copy.dialog.eyebrow}
              title={copy.dialog.heading}
              onClose={() => setDialogOpen(false)}
            >
              <DialogBody>
                <p>{copy.dialog.body}</p>
                <Field label={copy.dialog.field}>
                  <Input defaultValue={playgroundCopy.brand} />
                </Field>
              </DialogBody>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>
                  {copy.dialog.cancel}
                </Button>
                <Button variant="primary" onClick={() => setDialogOpen(false)}>
                  {copy.dialog.save}
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}
        </Section>

        <Section title={copy.toast.title}>
          <div className="ui-actions">
            <Button
              onClick={() =>
                toast.show({
                  message: copy.toast.message,
                  icon: <IconTrash size={16} aria-hidden="true" />,
                  action: {
                    label: copy.toast.undo,
                    icon: <IconArrowBackUp size={15} aria-hidden="true" />,
                    hint: copy.toast.undoHint,
                    onAction: () => {
                      toast.show({ message: copy.toast.undone });
                    },
                    closes: false,
                  },
                })
              }
            >
              {copy.toast.show}
            </Button>
            <Button
              onClick={() =>
                toast.show({ message: copy.toast.error, tone: "error" })
              }
            >
              {copy.toast.showError}
            </Button>
          </div>
        </Section>

        <Section title={copy.misc.title}>
          <div className="ui-actions">
            <Avatar name={playgroundCopy.person} size={36} />
            <Spinner />
            <span className="pg-soft">{copy.misc.loading}</span>
          </div>
          <p className="pg-soft">
            {copy.misc.shortcut} <Kbd>{copy.misc.shortcutKey}</Kbd>{" "}
            {copy.misc.shortcutAfter}
          </p>
          <EmptyState
            title={copy.misc.empty.title}
            actions={
              <Button variant="primary">{copy.misc.empty.action}</Button>
            }
          >
            {copy.misc.empty.text}
          </EmptyState>
        </Section>
      </div>
    </>
  );
}
