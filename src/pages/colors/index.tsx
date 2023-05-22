import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Colors />
    </QueryClientProvider>
  );
}

function Colors() {
  const fetchColors = async ({ pageParam = 1 }) => {
    try {
      const res = await fetch(
        `http://localhost:3500/colors?_page=${pageParam}&_limit=2`
      );
      console.log(pageParam);
      if (!res.ok) {
        throw new Error('Failed to fetch pages');
      }
      console.log(pageParam);
      return res.json();
    } catch (error: any) {
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<any | undefined, any, any, any>({
    queryKey: ['colors'],
    queryFn: fetchColors,
    getNextPageParam: (lastPage: any, pages: any) =>
      // lastPage.nextCursor,
      {
        if (pages.length < 4) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
  });
  console.log(data);
  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data?.pages.map((group: any, i: any) => (
        <React.Fragment key={i}>
          {group.map((color: any) => (
            <p key={color.id}>{color.label}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  );
}
