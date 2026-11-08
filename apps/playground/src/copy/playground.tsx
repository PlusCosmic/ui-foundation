/** The playground's words. Each area of an app gets a module like this one (see packages/ui/COPY.md). */
export const playgroundCopy = {
  brand: "Foundation",
  brandLink: "Foundation, home",
  nav: {
    components: "Components",
    appearance: "Appearance",
  },
  menu: {
    signedInAs: (name: string) => `Signed in as ${name}`,
    settings: "Settings",
    signOut: "Sign out",
  },
  person: "Alex Morgan",
  components: {
    eyebrow: "The foundation",
    title: (
      <>
        Every piece, <em>in one place</em>
      </>
    ),
    description:
      "The controls, messages and layout every app built on this starts with, in whichever scheme you pick.",
    buttons: {
      title: "Buttons",
      primary: "Save changes",
      secondary: "Cancel",
      ghost: "Skip",
      danger: "Delete",
      small: "Small",
      disabled: "Disabled",
      icon: "Settings",
    },
    fields: {
      title: "Fields",
      name: "Name",
      namePlaceholder: "Your name",
      nameHint: "How people see you.",
      email: "Email",
      emailError: "That doesn't look like an email address.",
      notes: "Notes",
      kind: "Kind",
      kinds: ["Draft", "Published", "Archived"],
      remember: "Remember me on this browser",
      search: "Search everything…",
    },
    tags: {
      title: "Chips and badges",
      chips: ["All", "This week", "Starred"],
      neutral: "12 items",
      accent: "New",
      danger: "Over the limit",
    },
    segmented: {
      title: "Segmented control",
      label: "Billing period",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    notices: {
      title: "Notices",
      neutral: {
        title: "Checking your payment",
        text: "This usually takes a few seconds.",
      },
      info: {
        title: "Your import is under way",
        text: "We'll let you know when it's done. You can leave this page.",
      },
      success: { title: "Saved", text: "Everyone on the project sees it now." },
      warning: {
        title: "Nearly full",
        text: "You've used 92% of your space.",
        action: "See plans",
      },
      error: {
        title: "That didn't save",
        text: "Nothing changed. Check your connection and try again.",
      },
      compact: "Couldn't reach the server. Try again.",
    },
    dialog: {
      title: "Dialog",
      open: "Open dialog",
      eyebrow: "Project",
      heading: "Rename project",
      body: "The new name shows everywhere the project does, straight away.",
      field: "Project name",
      cancel: "Cancel",
      save: "Rename",
    },
    toast: {
      title: "Toast",
      show: "Show toast",
      showError: "Show error",
      message: "Moved 3 items to the bin.",
      undo: "Undo",
      undoHint: "Ctrl+Z",
      undone: "Put 3 items back.",
      error: "That didn't work. Nothing changed.",
    },
    misc: {
      title: "Odds and ends",
      loading: "Loading…",
      shortcut: "Press",
      shortcutKey: "K",
      shortcutAfter: "to search",
      empty: {
        title: "Nothing here yet",
        text: "Things you add show up here.",
        action: "Add something",
      },
    },
  },
  appearance: {
    eyebrow: "Settings",
    title: "Appearance",
    description:
      "Light or dark follows your device until you pick one. The colour scheme is kept on this browser.",
    section: "Theme and colour",
  },
};
