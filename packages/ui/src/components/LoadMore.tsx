import { useUiCopy } from "../copy/UiCopyProvider";
import {
  type InfiniteScrollTarget,
  useInfiniteScroll,
} from "../hooks/useInfiniteScroll";
import { Button } from "./Button";
import { cx } from "./cx";
import { Spinner, VisuallyHidden } from "./Misc";

/**
 * The tail of a paged list: it loads the next page on its own as the reader reaches it, and only offers a button
 * where that can't happen — after a failed page, or without IntersectionObserver.
 */
export function LoadMore({
  className,
  label,
  query,
}: {
  className?: string;
  /** Plural noun for the items, as in "Load more posts". */
  label: string;
  query: InfiniteScrollTarget;
}) {
  const copy = useUiCopy();
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError } = query;
  const { sentinelRef, autoLoads } = useInfiniteScroll(query);

  if (!hasNextPage) return null;

  return (
    <div className={cx("ui-load-more", className)} ref={sentinelRef}>
      {isFetchNextPageError ? (
        <>
          <span className="ui-load-more-error">
            {copy.loadMore.failed(label)}
          </span>
          <Button onClick={() => query.fetchNextPage()}>{copy.tryAgain}</Button>
        </>
      ) : isFetchingNextPage || autoLoads ? (
        <Spinner />
      ) : (
        <Button onClick={() => query.fetchNextPage()}>
          {copy.loadMore.button(label)}
        </Button>
      )}
      <VisuallyHidden role="status">
        {isFetchingNextPage ? copy.loadMore.loading(label) : ""}
      </VisuallyHidden>
    </div>
  );
}
