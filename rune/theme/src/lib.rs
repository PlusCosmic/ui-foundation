//! The foundation's design language as a Rune theme: the colour schemes of `@pluscosmic/ui` (`assets/schemes/`,
//! generated from `packages/ui/src/styles/tokens.css` by `tools/theme.mjs`, so the two can't drift), its fonts, its
//! type, the mapping onto `rune-kit`'s [`Kit`], and the few components the web package has that `rune-kit` doesn't
//! ([`parts`]).
//!
//! ```ignore
//! let l = rune_theme_foundation::look(ColorScheme::Stacks, cx.system_dark());
//! rune_kit::Button::new("Save").variant(ButtonVariant::Submit).build(&l.kit)
//! ```

pub mod parts;

use std::sync::OnceLock;

use rune::{Color, Family, TextStyle, Theme};
use rune_kit::{Kit, PaletteFocus, PaletteSeed, Radius, StateColors};

/// The colour schemes, in the order the scheme picker shows them; the web package's `colorSchemes` names the same.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, Default)]
pub enum ColorScheme {
    #[default]
    Stacks,
    Oxblood,
    Ink,
    Walnut,
    Graphite,
}

impl ColorScheme {
    pub const ALL: [ColorScheme; 5] = [
        ColorScheme::Stacks,
        ColorScheme::Oxblood,
        ColorScheme::Ink,
        ColorScheme::Walnut,
        ColorScheme::Graphite,
    ];

    /// The name the web package and its local storage use.
    pub fn name(self) -> &'static str {
        match self {
            ColorScheme::Stacks => "stacks",
            ColorScheme::Oxblood => "oxblood",
            ColorScheme::Ink => "ink",
            ColorScheme::Walnut => "walnut",
            ColorScheme::Graphite => "graphite",
        }
    }

    /// A stored name as a scheme; anything this build doesn't know is the default, as on the web.
    pub fn from_name(name: &str) -> ColorScheme {
        ColorScheme::ALL
            .into_iter()
            .find(|s| s.name() == name)
            .unwrap_or_default()
    }

    /// The scheme as theme data.
    pub fn json(self) -> &'static str {
        match self {
            ColorScheme::Stacks => include_str!("../assets/schemes/stacks.json"),
            ColorScheme::Oxblood => include_str!("../assets/schemes/oxblood.json"),
            ColorScheme::Ink => include_str!("../assets/schemes/ink.json"),
            ColorScheme::Walnut => include_str!("../assets/schemes/walnut.json"),
            ColorScheme::Graphite => include_str!("../assets/schemes/graphite.json"),
        }
    }

    fn index(self) -> usize {
        ColorScheme::ALL
            .iter()
            .position(|s| *s == self)
            .unwrap_or(0)
    }
}

/// Instrument Sans (regular and semibold) and Fraunces (medium), for `AppSpec::fonts`.
pub const FONTS: &[&[u8]] = &[
    include_bytes!("../assets/fonts/InstrumentSans-Regular.ttf"),
    include_bytes!("../assets/fonts/InstrumentSans-SemiBold.ttf"),
    include_bytes!("../assets/fonts/Fraunces-Medium.ttf"),
];

/// `AppSpec::families`: (sans, mono). The foundation sets no code face, so both are the sans.
pub const FAMILIES: (&str, &str) = ("Instrument Sans", "Instrument Sans");

/// The display face, for headings and the wordmark.
pub const DISPLAY: Family = Family::Named("Fraunces");

/// The foundation's tokens for one scheme and appearance, by the names `tokens.css` gives them.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Tokens {
    pub bg: Color,
    pub bg_soft: Color,
    pub surface: Color,
    pub fg: Color,
    pub fg_soft: Color,
    pub line: Color,
    pub track_bg: Color,
    pub accent: Color,
    pub accent_ink: Color,
    pub fill: Color,
    pub fill_ink: Color,
    pub danger: Color,
    pub warning: Color,
    pub info: Color,
    pub shadow: Color,
    pub scrim: Color,
    pub tip_bg: Color,
    pub tip_ink: Color,
}

/// One scheme in one appearance: the tokens, the radii and the same as a `rune-kit` [`Kit`].
#[derive(Clone, Debug)]
pub struct Look {
    pub scheme: ColorScheme,
    pub dark: bool,
    pub t: Tokens,
    /// Controls' corners (`--radius`).
    pub radius: f32,
    /// Cards' corners (`--radius-lg`).
    pub radius_lg: f32,
    pub kit: Kit,
}

/// The parsed theme for one scheme and appearance.
pub fn theme(scheme: ColorScheme, dark: bool) -> &'static Theme {
    static THEMES: [[OnceLock<Theme>; 2]; 5] = [const { [const { OnceLock::new() }; 2] }; 5];
    THEMES[scheme.index()][dark as usize].get_or_init(|| {
        Theme::from_json(scheme.json(), dark)
            .unwrap_or_else(|e| panic!("assets/schemes/{}.json: {e}", scheme.name()))
    })
}

/// The look for one scheme and appearance, built once.
pub fn look(scheme: ColorScheme, dark: bool) -> &'static Look {
    static LOOKS: [[OnceLock<Look>; 2]; 5] = [const { [const { OnceLock::new() }; 2] }; 5];
    LOOKS[scheme.index()][dark as usize].get_or_init(|| build(scheme, dark))
}

/// The scheme's tokens on `rune-kit`'s schema.
pub fn kit(scheme: ColorScheme, dark: bool) -> &'static Kit {
    &look(scheme, dark).kit
}

/// `color-mix(in oklab, a p, b)`: `p` (0 to 1) of `a`, the rest `b`, as the web package mixes its tints.
pub fn mix(a: Color, p: f32, b: Color) -> Color {
    let (x, y) = (a.to_oklab(), b.to_oklab());
    let m = |i: usize| x[i] * p + y[i] * (1.0 - p);
    Color::from_oklab([m(0), m(1), m(2), m(3)])
}

fn tokens(t: &Theme) -> Tokens {
    let c = |name: &str| t.color(name);
    Tokens {
        bg: c("bg"),
        bg_soft: c("bg-soft"),
        surface: c("surface"),
        fg: c("fg"),
        fg_soft: c("fg-soft"),
        line: c("line"),
        track_bg: c("track-bg"),
        accent: c("accent"),
        accent_ink: c("accent-ink"),
        fill: c("fill"),
        fill_ink: c("fill-ink"),
        danger: c("danger"),
        warning: c("warning"),
        info: c("info"),
        shadow: c("shadow"),
        scrim: c("scrim"),
        tip_bg: c("tip-bg"),
        tip_ink: c("tip-ink"),
    }
}

fn build(scheme: ColorScheme, dark: bool) -> Look {
    let th = theme(scheme, dark);
    let t = tokens(th);
    Look {
        scheme,
        dark,
        t,
        radius: th.num("radius"),
        radius_lg: th.num("radius-lg"),
        kit: map_kit(&t, dark, th),
    }
}

/// The foundation's tokens on the kit's roles, over a palette the kit derives from the page, its ink and the fill.
/// The tints are the ones the web package's components mix (`components.css`), so a Rune notice or badge reads as
/// the web one does.
fn map_kit(t: &Tokens, dark: bool, th: &Theme) -> Kit {
    let mut kit = Kit::from_palette_focus(
        PaletteSeed {
            bg: t.bg,
            fg: t.fg,
            accent: t.fill,
        },
        PaletteFocus::Accent,
    );
    kit.dark = dark;
    let faint = mix(t.fg_soft, 0.7, t.bg);
    let p = &mut kit.c;
    p.page = t.bg;
    p.bg_base = t.bg;
    p.bg_deep = t.bg_soft;
    p.layer_01 = t.surface;
    p.layer_02 = t.bg_soft;
    p.layer_03 = t.track_bg;
    p.layer_04 = t.track_bg;
    p.bg_button_neutral = t.bg_soft;
    p.bg_accent = t.fill;
    // The kit's filled buttons (`Submit`, `Contrast`, and the icon button's) are the web's primary button.
    p.bg_contrast = t.fill;
    p.bg_icon_button_contrast = t.fill;
    p.submit_fg = t.fill_ink;
    p.submit_icon = t.fill_ink;
    p.text_base = t.fg;
    p.text_muted = t.fg_soft;
    p.text_faint = faint;
    p.text_contrast = t.fill_ink;
    p.text_accent = t.accent;
    p.icon_base = t.fg_soft;
    p.icon_muted = t.fg_soft;
    p.icon_faint = faint;
    p.icon_contrast = t.fill_ink;
    p.icon_accent = t.accent;
    p.border_muted = t.bg_soft;
    p.border_base = t.line;
    p.border_strong = mix(t.fg_soft, 0.35, t.line);
    p.border_focus = t.accent;
    p.knob = t.fill_ink;
    p.knob_on = t.fill_ink;
    // Notice tones: an 8% tint of the tone over the page, its edge 40% of the tone over the line.
    let state = |tone: Color, ink: Color| StateColors {
        bg: mix(tone, 0.08, t.bg),
        fg: ink,
        border: mix(tone, 0.4, t.line),
        icon: ink,
    };
    p.success = state(t.accent, t.accent_ink);
    p.warning = state(t.warning, mix(t.warning, 0.7, t.fg));
    p.danger = state(t.danger, mix(t.danger, 0.72, t.fg));
    p.info = state(t.info, t.info);
    p.scrim = mix(t.bg, 0.68, Color::BLACK.alpha(0.42));
    p.surface_base = t.surface;
    p.surface_weak = t.bg_soft;
    p.surface_raised = t.surface;
    p.surface_raised_base = t.surface;
    p.text_strong = t.fg;
    p.text_weak = t.fg_soft;
    p.std_text = t.fg;
    p.std_border = t.line;
    kit.radius = Radius {
        xs: 1.5,
        sm: th.num("radius"),
        md: th.num("radius-lg"),
        lg: 8.0,
        xl: 10.0,
    };
    kit.blend_over = Some(t.bg);
    kit.ty.ui = ty::BUTTON;
    kit.ty.ui_medium = ty::BUTTON;
    kit.ty.body = ty::BODY;
    kit.ty.body_medium = ty::BODY_STRONG;
    kit.ty.text_small = ty::SMALL;
    kit
}

/// The web package's type scale in points (its CSS line heights as `lh`).
pub mod ty {
    use rune::TextStyle;

    use super::DISPLAY;

    /// `PageHeader`'s title: Fraunces, `clamp(32px, 5vw, 44px)` at its desktop size.
    pub const PAGE_TITLE: TextStyle = TextStyle::new(40.0, 500.0)
        .family(DISPLAY)
        .lh(42.0)
        .tracking(-0.4);
    /// A dialog's title.
    pub const DIALOG_TITLE: TextStyle = TextStyle::new(22.0, 500.0).family(DISPLAY).lh(24.2);
    /// The wordmark: Fraunces 27. (The web sets it in italic; the bundled Fraunces is upright only.)
    pub const WORDMARK: TextStyle = TextStyle::new(27.0, 500.0)
        .family(DISPLAY)
        .lh(27.0)
        .tracking(-0.27);
    /// The small capitals over a heading: 12, semibold, `letter-spacing: 1.4px`, set in capitals by the caller.
    pub const EYEBROW: TextStyle = TextStyle::new(12.0, 600.0).lh(15.0).tracking(1.4);
    pub const BODY: TextStyle = TextStyle::new(14.0, 400.0).lh(21.0);
    pub const BODY_STRONG: TextStyle = TextStyle::new(14.0, 600.0).lh(21.0);
    pub const LEAD: TextStyle = TextStyle::new(15.0, 400.0).lh(22.5);
    pub const SMALL: TextStyle = TextStyle::new(13.0, 400.0).lh(19.5);
    pub const LABEL: TextStyle = TextStyle::new(12.0, 600.0).lh(15.0);
    pub const BUTTON: TextStyle = TextStyle::new(13.0, 600.0).lh(16.0);
    pub const CHIP: TextStyle = TextStyle::new(12.0, 600.0).lh(15.0);
}

/// A `TextStyle` in the display face.
pub fn display(size: f32) -> TextStyle {
    TextStyle::new(size, 500.0).family(DISPLAY)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_scheme_resolves_in_both_appearances() {
        for scheme in ColorScheme::ALL {
            for dark in [false, true] {
                let l = look(scheme, dark);
                assert_eq!(l.dark, dark);
                assert_eq!(l.kit.dark, dark);
                assert!(l.radius > 0.0 && l.radius_lg >= l.radius);
                // Text reads on the page: at least 4.5:1, as the web's tokens are chosen to.
                let contrast = |a: Color, b: Color| {
                    let (a, b) = (a.luminance(), b.luminance());
                    (a.max(b) + 0.05) / (a.min(b) + 0.05)
                };
                assert!(
                    contrast(l.t.fg, l.t.bg) >= 4.5,
                    "{scheme:?} dark={dark}: fg on bg"
                );
                assert!(
                    contrast(l.t.fill_ink, l.t.fill) >= 4.5,
                    "{scheme:?} dark={dark}: fill-ink on fill"
                );
            }
        }
    }

    #[test]
    fn the_kits_filled_buttons_are_the_primary_fill() {
        for scheme in ColorScheme::ALL {
            for dark in [false, true] {
                let l = look(scheme, dark);
                assert_eq!(l.kit.c.bg_icon_button_contrast, l.t.fill);
                assert_eq!(l.kit.c.bg_contrast, l.t.fill);
                assert_eq!(l.kit.c.submit_fg, l.t.fill_ink);
            }
        }
    }

    #[test]
    fn scheme_names_match_the_web_package() {
        let ts = include_str!("../../../packages/ui/src/theme/schemes.js");
        let list = &ts[ts
            .find("colorSchemes = [")
            .expect("schemes.js lists the schemes")..];
        let list = &list[..list.find(']').unwrap()];
        let web: Vec<&str> = list.split('"').skip(1).step_by(2).collect();
        let rune: Vec<&str> = ColorScheme::ALL.iter().map(|s| s.name()).collect();
        assert_eq!(
            web, rune,
            "ColorScheme::ALL and the web's colorSchemes (schemes.js) name the same schemes in the same order"
        );
        assert_eq!(ColorScheme::from_name("green"), ColorScheme::Stacks);
    }
}
