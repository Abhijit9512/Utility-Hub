type EventProps = Record<string, string | number | boolean>;

export const analytics = {
  track(event: string, props?: EventProps) {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.gtag?.("event", event, props);
      // @ts-ignore
      window.dataLayer?.push({ event, ...props });
      if (import.meta.env.DEV) {
        console.debug("[analytics]", event, props);
      }
    }
  },
  pageview(path: string) {
    this.track("page_view", { page_path: path });
  }
};
