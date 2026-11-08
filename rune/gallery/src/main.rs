//! The playground's components in Rune, on the foundation's theme: `rune-kit`'s controls themed by
//! `rune_theme_foundation::kit`, beside the theme's own parts. `cargo run -p foundation-gallery` opens it;
//! `-- --snap out.png --scene ink-dark` renders a scene headless.
//!
//! A gallery's words are its content, so they're written here rather than in a copy module.

use rune::{AppSpec, Cx, El, ScrollSpec, TextEdit, Tx, col, row, text};
use rune_kit::{
    Badge, BadgeVariant, Button, ButtonVariant, Checkbox, Dialog, Field, Keybind, SegmentedControl,
    Spinner, TextInput, Toast,
};
use rune_theme_foundation::parts::{self, Notice, Tone};
use rune_theme_foundation::{ColorScheme, FAMILIES, FONTS, Look, look};

struct Gallery {
    scheme: ColorScheme,
    /// None follows the system, as "Match system" does.
    dark: Option<bool>,
    chip: usize,
    period: usize,
    remember: bool,
    dialog: bool,
    name: TextEdit,
    email: TextEdit,
}

impl Default for Gallery {
    fn default() -> Gallery {
        Gallery {
            scheme: ColorScheme::Stacks,
            dark: None,
            chip: 0,
            period: 0,
            remember: true,
            dialog: false,
            name: TextEdit::new(""),
            email: TextEdit::new("alex@"),
        }
    }
}

const CHIPS: [&str; 3] = ["All", "This week", "Starred"];

fn section(l: &Look, key: &str, title: &str, children: Vec<El>) -> El {
    col()
        .key(key)
        .w(340.0)
        .gap(14.0)
        .padding(20.0)
        .radius(l.radius_lg)
        .fill(l.t.surface)
        .border(1.0, l.t.line)
        .child(parts::eyebrow(l, title))
        .children(children)
}

fn view(s: &Gallery, cx: &mut Cx<Gallery>) -> El {
    let dark = s.dark.unwrap_or_else(|| cx.system_dark());
    let l = look(s.scheme, dark);
    let k = &l.kit;
    let mut layer = Vec::new();

    let buttons = section(
        l,
        "buttons",
        "Buttons",
        vec![
            row()
                .gap(10.0)
                .flex_wrap()
                .child(
                    Button::new("Save changes")
                        .variant(ButtonVariant::Submit)
                        .build(k),
                )
                .child(Button::new("Cancel").build(k))
                .child(Button::new("Skip").variant(ButtonVariant::Ghost).build(k))
                .child(
                    Button::new("Delete")
                        .variant(ButtonVariant::Danger)
                        .build(k),
                ),
        ],
    );

    let fields = section(
        l,
        "fields",
        "Fields",
        vec![
            Field::new()
                .label("Name")
                .control(
                    TextInput::new(&s.name)
                        .placeholder("Your name")
                        .on_edit(|s: &mut Gallery| &mut s.name)
                        .build(k),
                )
                .build(k),
            Field::new()
                .label("Email")
                .control(
                    TextInput::new(&s.email)
                        .invalid(true)
                        .on_edit(|s: &mut Gallery| &mut s.email)
                        .build(k),
                )
                .build(k),
            Notice::new(Tone::Error)
                .compact()
                .body("That doesn't look like an email address.")
                .build(l),
            Checkbox::new(s.remember)
                .label("Remember me on this browser")
                .on_toggle(|s: &mut Gallery| s.remember = !s.remember)
                .build(k),
        ],
    );

    let mut chips = row().gap(6.0).flex_wrap();
    for (index, label) in CHIPS.iter().enumerate() {
        chips = chips.child(parts::chip(
            l,
            &format!("chip-{index}"),
            label,
            s.chip == index,
            move |s: &mut Gallery| s.chip = index,
        ));
    }
    let tags = section(
        l,
        "tags",
        "Chips and badges",
        vec![
            chips,
            row()
                .gap(8.0)
                .child(Badge::new("12 items").build(k))
                .child(Badge::new("New").variant(BadgeVariant::Accent).build(k)),
            SegmentedControl::new(&["Monthly", "Yearly"], Some(s.period))
                .label("Billing period")
                .on_pick(|s: &mut Gallery, index: usize, _: &mut Tx| s.period = index)
                .build(k),
        ],
    );

    let notices = section(
        l,
        "notices",
        "Notices",
        vec![
            Notice::new(Tone::Info)
                .title("Your import is under way")
                .body("We'll let you know when it's done. You can leave this page.")
                .build(l),
            Notice::new(Tone::Success)
                .title("Saved")
                .body("Everyone on the project sees it now.")
                .build(l),
            Notice::new(Tone::Warning)
                .title("Nearly full")
                .body("You've used 92% of your space.")
                .action(
                    Button::new("See plans")
                        .variant(ButtonVariant::Submit)
                        .build(k),
                )
                .build(l),
            Notice::new(Tone::Error)
                .title("That didn't save")
                .body("Nothing changed. Check your connection and try again.")
                .build(l),
        ],
    );

    let messages = section(
        l,
        "messages",
        "Dialog and toast",
        vec![
            Button::new("Open dialog")
                .on_press(|s: &mut Gallery| s.dialog = true)
                .build(k),
            Toast::new("toast", "Moved 3 items to the bin.")
                .action(k, "Undo", true, |_: &mut Gallery, _: &mut Tx| {})
                .closable()
                .build(k),
        ],
    );

    let odds = section(
        l,
        "odds",
        "Odds and ends",
        vec![
            row()
                .gap(10.0)
                .center_y()
                .child(parts::avatar(l, "Alex Morgan", 36.0))
                .child(Spinner::new().build(k))
                .child(
                    text("Loading…")
                        .font(rune_theme_foundation::ty::BODY)
                        .color(l.t.fg_soft),
                )
                .child(Keybind::new(&["Ctrl", "K"]).build(k)),
            parts::empty_state(
                l,
                "Nothing here yet",
                "Things you add show up here.",
                vec![
                    Button::new("Add something")
                        .variant(ButtonVariant::Submit)
                        .build(k),
                ],
            ),
        ],
    );

    let theme_pick = match s.dark {
        Some(false) => 0,
        Some(true) => 1,
        None => 2,
    };
    let appearance = col()
        .key("appearance")
        .gap(12.0)
        .child(parts::eyebrow(l, "Appearance"))
        .child(
            SegmentedControl::new(&["Light", "Dark", "Match system"], Some(theme_pick))
                .label("Theme")
                .on_pick(|s: &mut Gallery, index: usize, _: &mut Tx| {
                    s.dark = [Some(false), Some(true), None][index]
                })
                .build(k),
        )
        .child(parts::scheme_picker(
            s.scheme,
            dark,
            scheme_words,
            |s: &mut Gallery, scheme: ColorScheme, _: &mut Tx| s.scheme = scheme,
        ));

    Dialog::new("rename", "Rename project")
        .description("The new name shows everywhere the project does, straight away.")
        .open(s.dialog)
        .fit()
        .child(
            row()
                .w_full()
                .justify_end()
                .gap(10.0)
                .child(
                    Button::new("Cancel")
                        .on_press(|s: &mut Gallery| s.dialog = false)
                        .build(k),
                )
                .child(
                    Button::new("Rename")
                        .variant(ButtonVariant::Submit)
                        .on_press(|s: &mut Gallery| s.dialog = false)
                        .build(k),
                ),
        )
        .on_close(|s: &mut Gallery| s.dialog = false)
        .build(k, &mut layer);

    let page = col()
        .w_full()
        .padding(32.0)
        .gap(20.0)
        .child(
            row()
                .w_full()
                .justify_between()
                .center_y()
                .mb(16.0)
                .child(parts::wordmark(l, "Foundation"))
                .child(parts::avatar(l, "Alex Morgan", 28.0)),
        )
        .child(parts::page_header(
            l,
            Some("The foundation"),
            "Every piece, in one place",
            Some("The controls, messages and layout every app built on this starts with, in whichever scheme you pick."),
        ))
        .child(
            row()
                .w_full()
                .gap(20.0)
                .flex_wrap()
                .items_start()
                .children([buttons, fields, tags, notices, messages, odds]),
        )
        .child(appearance.mt(12.0));

    rune_kit::root(
        col()
            .key("page")
            .w_full()
            .h_full()
            .fill(l.t.bg)
            .scroll(ScrollSpec {
                stick_bottom: false,
            })
            .child(page),
        layer,
    )
}

fn scheme_words(scheme: ColorScheme) -> (String, String) {
    let (name, description) = match scheme {
        ColorScheme::Stacks => ("Stacks", "Green, and the default."),
        ColorScheme::Oxblood => ("Oxblood", "Red-brown leather and wine."),
        ColorScheme::Ink => ("Ink", "Blue-black ink and cool slate."),
        ColorScheme::Walnut => ("Walnut", "Dark wood and brass."),
        ColorScheme::Graphite => ("Graphite", "No tint, so your content carries the colour."),
    };
    (name.to_owned(), description.to_owned())
}

/// One scene per scheme in each appearance, plus the dialog open.
macro_rules! scene {
    ($scheme:ident, $dark:expr) => {
        |s: &mut Gallery| {
            s.scheme = ColorScheme::$scheme;
            s.dark = Some($dark);
        }
    };
}

/// A named state for `--scene`.
type Scene = (&'static str, fn(&mut Gallery));

const SCENES: &[Scene] = &[
    ("stacks-light", scene!(Stacks, false)),
    ("stacks-dark", scene!(Stacks, true)),
    ("oxblood-light", scene!(Oxblood, false)),
    ("oxblood-dark", scene!(Oxblood, true)),
    ("ink-light", scene!(Ink, false)),
    ("ink-dark", scene!(Ink, true)),
    ("walnut-light", scene!(Walnut, false)),
    ("walnut-dark", scene!(Walnut, true)),
    ("graphite-light", scene!(Graphite, false)),
    ("graphite-dark", scene!(Graphite, true)),
    ("dialog", |s| {
        s.scheme = ColorScheme::Ink;
        s.dark = Some(true);
        s.dialog = true;
    }),
];

fn main() {
    rune::run(AppSpec::<Gallery> {
        scenes: SCENES,
        fonts: FONTS,
        families: FAMILIES,
        ..AppSpec::new("Foundation", (1140.0, 1500.0), Gallery::default, view)
    });
}
