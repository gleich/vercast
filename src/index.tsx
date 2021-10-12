import {
  ActionPanel,
  CopyToClipboardAction,
  List,
  OpenInBrowserAction,
  render,
  showToast,
  ToastStyle,
} from "@raycast/api";
import fetch from "node-fetch";

async function main() {
  const articles = await fetchArticles();
  render(<ArticleList articles={articles} />);
}

main();

async function fetchArticles(): Promise<Record<string, string>[]> {
  try {
    const response = await fetch("https://raycast.com/feed.json");
    const json = await response.json();
    return (json as Record<string, unknown>).items as Record<string, string>[];
  } catch (error) {
    console.error(error);
    showToast(ToastStyle.Failure, "Could not load articles");
    return Promise.resolve([]);
  }
}

function ArticleList(props: { articles: Record<string, string>[] }) {
  return (
    <List searchBarPlaceholder="Filter articles by name...">
      {props.articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </List>
  );
}

function ArticleListItem(props: { article: Record<string, string> }) {
  const article = props.article;
  return (
    <List.Item
      id={article.id}
      title={article.title}
      subtitle="Raycast Blog"
      icon="list-icon.png"
      accessoryTitle={new Date(article.date_modified).toLocaleDateString()}
    >
      <ActionPanel>
        <OpenInBrowserAction url={article.url} />
        <CopyToClipboardAction title="Copy URL" content={article.url} />
      </ActionPanel>
    </List.Item>
  );
}
