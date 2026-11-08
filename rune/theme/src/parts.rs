//! The web package's pieces that `rune-kit` has no component for, drawn as `components.css` draws them: notices,
//! chips, avatars, empty states, page headers and eyebrows, the wordmark and the colour scheme picker. Everything
//! else (buttons, fields, selects, dialogs, toasts, segmented controls, badges, menus) is `rune-kit`'s, themed by
//! [`crate::kit`].

use rune::{Color, Cursor, El, Icon, Tx, col, el, icon, row, text};

use crate::{ColorScheme, Look, look, mix, ty};

/// A notice's tone; the icon and the edge carry it as well as the colour.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Default)]
pub enum Tone {
    #[default]
    Info,
    Success,
    Warning,
    Error,
}

impl Tone {
    fn color(self, l: &Look) -> Color {
        match self {
            Tone::Info => l.t.info,
            Tone::Success => l.t.accent,
            Tone::Warning => l.t.warning,
            Tone::Error => l.t.danger,
        }
    }

    fn icon(self) -> &'static Icon {
        match self {
            Tone::Info => &icons::INFO,
            Tone::Success => &icons::CHECK_CIRCLE,
            Tone::Warning => &icons::WARNING,
            Tone::Error => &icons::X_CIRCLE,
        }
    }
}

/// A message in one of four tones (`Notice` in the web package): an 8% tint, an edge in the tone, its icon, a title,
/// a line of text and actions. `compact` is the one-line form for under a form.
pub struct Notice {
    tone: Tone,
    title: Option<String>,
    body: Option<String>,
    actions: Vec<El>,
    compact: bool,
}

impl Notice {
    pub fn new(tone: Tone) -> Notice {
        Notice {
            tone,
            title: None,
            body: None,
            actions: Vec::new(),
            compact: false,
        }
    }
    pub fn title(mut self, title: impl Into<String>) -> Self {
        self.title = Some(title.into());
        self
    }
    pub fn body(mut self, body: impl Into<String>) -> Self {
        self.body = Some(body.into());
        self
    }
    pub fn action(mut self, action: El) -> Self {
        self.actions.push(action);
        self
    }
    pub fn compact(mut self) -> Self {
        self.compact = true;
        self
    }

    pub fn build(self, l: &Look) -> El {
        let t = &l.t;
        let tone = self.tone.color(l);
        // Errors are announced as alerts, the rest as status, as on the web.
        let role = if self.tone == Tone::Error {
            "alert"
        } else {
            "status"
        };
        if self.compact {
            let ink = match self.tone {
                Tone::Error => t.danger,
                Tone::Success => t.accent_ink,
                Tone::Info | Tone::Warning => t.fg,
            };
            let edge = if self.tone == Tone::Warning {
                mix(t.warning, 0.55, t.line)
            } else {
                t.line
            };
            let words = self.body.or(self.title).unwrap_or_default();
            return row()
                .role(role)
                .w_full()
                .px(10.0)
                .py(8.0)
                .radius(l.radius)
                .fill(t.bg_soft)
                .border(1.0, edge)
                .child(text(words).font(ty::SMALL).color(ink).wrap());
        }
        let icon_ink = if self.tone == Tone::Warning {
            mix(t.warning, 0.7, t.fg)
        } else {
            tone
        };
        let mut body = col().grow(1.0).min_w(0.0).gap(6.0);
        if let Some(title) = self.title {
            body = body.child(text(title).font(ty::BODY_STRONG).color(t.fg).wrap());
        }
        if let Some(words) = self.body {
            body = body.child(text(words).font(ty::BODY).color(t.fg_soft).wrap());
        }
        if !self.actions.is_empty() {
            body = body.child(row().mt(4.0).gap(10.0).flex_wrap().children(self.actions));
        }
        row()
            .role(role)
            .w_full()
            .radius(l.radius_lg)
            .fill(mix(tone, 0.08, t.bg))
            .border(1.0, mix(tone, 0.4, t.line))
            .clip_rounded(l.radius_lg)
            // The web's 4px left border, as a bar inside the 1px edge.
            .child(el().w(3.0).self_stretch().fill(tone).a11y_hidden())
            .child(
                row()
                    .grow(1.0)
                    .min_w(0.0)
                    .items_start()
                    .gap(10.0)
                    .pl(11.0)
                    .pr(14.0)
                    .py(12.0)
                    .child(
                        icon(self.tone.icon(), 18.0)
                            .color(icon_ink)
                            .mt(1.0)
                            .a11y_hidden(),
                    )
                    .child(body),
            )
    }
}

/// A small toggle, such as a filter (`Chip`): outlined, the accent's tint while on.
pub fn chip<S: 'static>(
    l: &Look,
    key: &str,
    label: &str,
    active: bool,
    on_press: impl Fn(&mut S) + 'static,
) -> El {
    let t = &l.t;
    let (fill, border, ink) = if active {
        (mix(t.accent, 0.12, t.bg), t.accent, t.accent_ink)
    } else {
        (Color::TRANSPARENT, t.line, t.fg_soft)
    };
    row()
        .key(key)
        .role("button")
        .label(label)
        .checked(active)
        .focusable(true)
        .focus_ring(2.0, 1.0, t.accent)
        .cursor(Cursor::Pointer)
        .px(11.0)
        .py(5.0)
        .radius(l.radius)
        .fill(fill)
        .border(1.0, border)
        .hover(t.fg.alpha(0.05))
        .on_press(on_press)
        .child(text(label).font(ty::CHIP).color(ink))
}

/// A person's initials on the fill colour (`Avatar`); pictures are the app's to draw over it.
pub fn avatar(l: &Look, name: &str, size: f32) -> El {
    let initials: String = name
        .split_whitespace()
        .take(2)
        .filter_map(|part| part.chars().next())
        .flat_map(char::to_uppercase)
        .collect();
    el().size(size, size)
        .radius(size / 2.0)
        .fill(l.t.fill)
        .center()
        .role("img")
        .label(name)
        .child(
            text(initials)
                .font(rune::TextStyle::new(size * 0.38, 600.0))
                .color(l.t.fill_ink)
                .a11y_hidden(),
        )
}

/// The small capitals over a heading.
pub fn eyebrow(l: &Look, words: &str) -> El {
    text(words.to_uppercase())
        .font(ty::EYEBROW)
        .color(l.t.fg_soft)
}

/// The top of a page (`PageHeader`): an eyebrow, the title in the display face, a line under it.
pub fn page_header(
    l: &Look,
    eyebrow_words: Option<&str>,
    title: &str,
    description: Option<&str>,
) -> El {
    let mut header = col().w_full().gap(8.0).mb(24.0);
    if let Some(words) = eyebrow_words {
        header = header.child(eyebrow(l, words));
    }
    header = header.child(
        text(title)
            .role("heading")
            .level(1)
            .font(ty::PAGE_TITLE)
            .color(l.t.fg)
            .wrap(),
    );
    if let Some(words) = description {
        header = header.child(
            text(words)
                .font(ty::LEAD)
                .color(l.t.fg_soft)
                .wrap()
                .max_w(560.0)
                .mt(2.0),
        );
    }
    header
}

/// In place of a list with nothing in it yet (`EmptyState`): a dashed box, a title, a line and actions.
pub fn empty_state(l: &Look, title: &str, words: &str, actions: Vec<El>) -> El {
    col()
        .w_full()
        .items_center()
        .gap(10.0)
        .padding(34.0)
        .radius(l.radius)
        .border(1.0, l.t.line)
        .border_dash(4.0, 3.0)
        .child(text(title).font(ty::BODY_STRONG).color(l.t.fg))
        .child(text(words).font(ty::BODY).color(l.t.fg_soft).wrap())
        .child(row().gap(10.0).children(actions))
}

/// The app's name in the display face.
pub fn wordmark(l: &Look, name: &str) -> El {
    text(name).font(ty::WORDMARK).color(l.t.fg)
}

/// A card per colour scheme (`AppearanceSettings`' scheme cards), each previewing its own tokens in the current
/// appearance. `on_pick` gets the scheme chosen; keeping it (and saving it to an account) is the app's.
pub fn scheme_picker<S: 'static>(
    current: ColorScheme,
    dark: bool,
    names: impl Fn(ColorScheme) -> (String, String),
    on_pick: impl Fn(&mut S, ColorScheme, &mut Tx) + Clone + 'static,
) -> El {
    let l = look(current, dark);
    let mut cards = row()
        .key("schemes")
        .role("radiogroup")
        .gap(10.0)
        .flex_wrap();
    for scheme in ColorScheme::ALL {
        let p = look(scheme, dark);
        let (name, description) = names(scheme);
        let chosen = scheme == current;
        let pick = on_pick.clone();
        let preview = col()
            .w_full()
            .radius(l.radius)
            .fill(p.t.bg)
            .border(1.0, p.t.fg.alpha(0.1))
            .clip_rounded(l.radius)
            .a11y_hidden()
            .child(
                col()
                    .mx(6.0)
                    .mt(6.0)
                    .h(46.0)
                    .gap(5.0)
                    .px(7.0)
                    .py(8.0)
                    .radius(2.0)
                    .fill(p.t.surface)
                    .border(1.0, p.t.line)
                    .child(el().w_frac(0.7).h(4.0).radius(2.0).fill(p.t.fg))
                    .child(el().w_frac(0.9).h(4.0).radius(2.0).fill(mix(
                        p.t.fg_soft,
                        0.6,
                        p.t.surface,
                    )))
                    .child(el().w_frac(0.5).h(4.0).radius(2.0).fill(mix(
                        p.t.fg_soft,
                        0.6,
                        p.t.surface,
                    ))),
            )
            .child(
                row()
                    .w_full()
                    .justify_between()
                    .center_y()
                    .px(7.0)
                    .pt(7.0)
                    .pb(8.0)
                    .child(el().w_frac(0.4).h(4.0).radius(2.0).fill(p.t.accent))
                    .child(el().size(24.0, 10.0).radius(2.0).fill(p.t.fill)),
            );
        let card = col()
            .key(format!("scheme-{}", scheme.name()))
            .role("radio")
            .label(name.clone())
            .checked(chosen)
            .focusable(true)
            .focus_ring(2.0, 2.0, l.t.accent)
            .cursor(Cursor::Pointer)
            .w(118.0)
            .gap(3.0)
            .px(8.0)
            .pt(8.0)
            .pb(10.0)
            .radius(l.radius_lg)
            .fill(l.t.surface)
            .border(
                if chosen { 2.0 } else { 1.0 },
                if chosen { l.t.accent } else { l.t.line },
            )
            .on_press_tx(move |s: &mut S, tx: &mut Tx| pick(s, scheme, tx))
            .child(preview.mb(5.0))
            .child(
                text(name)
                    .font(rune::TextStyle::new(13.0, 600.0).lh(16.0))
                    .color(l.t.fg),
            )
            .child(
                text(description)
                    .font(rune::TextStyle::new(12.0, 400.0).lh(16.0))
                    .color(l.t.fg_soft)
                    .wrap(),
            );
        cards = cards.child(card);
    }
    cards
}

/// The tone icons, in one colour (the element's), as Tabler draws them on the web.
pub mod icons {
    use rune::Icon;

    pub static INFO: Icon = Icon {
        name: "foundation-info",
        view: 24.0,
        body: r#"<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01M11 12h1v4h1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>"#,
    };

    pub static CHECK_CIRCLE: Icon = Icon {
        name: "foundation-check-circle",
        view: 24.0,
        body: r#"<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>"#,
    };

    pub static WARNING: Icon = Icon {
        name: "foundation-warning",
        view: 24.0,
        body: r#"<path d="M10.24 3.96 2.4 17.5A2 2 0 0 0 4.14 20.5h15.72a2 2 0 0 0 1.74-3L13.76 3.96a2 2 0 0 0-3.52 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>"#,
    };

    pub static X_CIRCLE: Icon = Icon {
        name: "foundation-x-circle",
        view: 24.0,
        body: r#"<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 10l4 4m0-4l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>"#,
    };
}
