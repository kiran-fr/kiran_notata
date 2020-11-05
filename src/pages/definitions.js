// **********
// * ROUTES *
// **********
// PUBLIC

export const frontpage = "/";
// USER

export const signOut = "/signout";
export const login = "/login";
export const forgotPassword = "/forgotPassword";
export const signup = "/signup";
export const awaiting = "/awaiting";

export const pre_profile = "/profile";
// SHARING

export const link_bridge = `/link`;
// LOGGED IN PAGES

export const dashboard = "/dashboard";

export const startup_page = `${dashboard}/startup_page`;

export const profile = `${dashboard}/profile`;
export const report = `${dashboard}/report`;
export const inbox = `${dashboard}/inbox`;
export const activities = `${dashboard}/activities`;
export const tags = `${dashboard}/tags`;
export const settings = `${dashboard}/settings`;
export const team = `${dashboard}/team`;
export const templates = `${dashboard}/templates`;

export const evaluation_templates = `${dashboard}/templates`;
export const evaluation_template = `${evaluation_templates}/edit`;

export const evaluation_template_summary = `${evaluation_templates}/summary`;

export const group = `${dashboard}/group`;

export const external_form = `${dashboard}/external_form`;

// PUBLIC ROUTES
export const public_pages = `/public`;
export const public_creative = `${public_pages}/creative`;
export const demo_page = `${public_pages}/demo`;
