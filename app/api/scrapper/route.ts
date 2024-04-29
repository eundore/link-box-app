import axios from "axios";
import { parse } from "parse5";

export interface ScrapedData {
  imageUrl: string;
  title: string;
  description: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") ?? "";

    // HTML 가져오기
    const response = await axios.get(
      url
      //"https://f-lab.kr/blog/frontend-interview-1"
      //"https://velog.io/@tt8784/Nextjs13-nextbundle-analyzer-%EB%B0%8F-%EC%B5%9C%EC%A0%81%ED%99%94-feat.-react-icons"
      // "https://eratosthenes.tistory.com/2"
    );

    const html = response.data;
    // HTML 파싱
    const document = parse(html);

    // 이미지 추출 로직
    let imageUrl = findImgSrc(html);
    console.log("imageUrl : ", imageUrl);

    // 제목 추출 로직
    let title = findTitle(html);
    console.log("title : ", title);
    // const titleTag = document.childNodes.find(
    //   (node) => node.nodeName === "title"
    // );
    // if (
    //   titleTag &&
    //   "childNodes" in titleTag &&
    //   titleTag.childNodes.length > 0
    // ) {
    //   const titleText = titleTag.childNodes[0];
    //   if (titleText.nodeName === "#text" && "value" in titleText) {
    //     title = titleText.value;
    //   }
    // }

    // 설명 추출 로직
    let description = findDescription(html);
    console.log("description : ", description);
    // const metaDescriptionTag = document.childNodes.find((node) => {
    //   return (
    //     node.nodeName === "meta" &&
    //     node.attrs.some(
    //       (attr) => attr.name === "name" && attr.value === "description"
    //     )
    //   );
    // });
    // if (metaDescriptionTag && "attrs" in metaDescriptionTag) {
    //   const contentAttribute = metaDescriptionTag.attrs.find(
    //     (attr) => attr.name === "content"
    //   );
    //   if (contentAttribute) {
    //     description = contentAttribute.value;
    //   }
    // }

    const scrapedData: ScrapedData = { imageUrl, title, description };

    return new Response(JSON.stringify(scrapedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error scraping website:", error);

    return new Response(
      JSON.stringify({ message: "Failed to scrape website" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function findImgSrc(html: string): string {
  const document = parse(html);

  function traverse(node: any): string {
    if (node.nodeName === "img") {
      for (const attr of node.attrs) {
        if (attr.name === "src") {
          if (attr.value.includes(".jpg") || attr.value.includes(".png")) {
            return attr.value;
          }
        }
      }
    }

    if ("childNodes" in node) {
      for (const childNode of node.childNodes) {
        if ((childNode as Element).tagName !== undefined) {
          const result = traverse(childNode as Element);
          if (result) {
            return result;
          }
        }
      }
    }

    return "";
  }

  return traverse(document);
}

function findTitle(html: string): string {
  const document = parse(html);

  function traverse(node: any): string {
    if (node.nodeName === "h1") {
      return node.childNodes[0].value;
    }

    if ("childNodes" in node) {
      for (const childNode of node.childNodes) {
        if ((childNode as Element).tagName !== undefined) {
          const result = traverse(childNode as Element);
          if (result) {
            return result;
          }
        }
      }
    }

    return "";
  }

  return traverse(document);
}

function findDescription(html: string): string {
  const document = parse(html);

  function traverse(node: any): string {
    if (node.nodeName === "p") {
      if (node.childNodes[0].value.length > 20) return node.childNodes[0].value;
    }

    if ("childNodes" in node) {
      for (const childNode of node.childNodes) {
        if ((childNode as Element).tagName !== undefined) {
          const result = traverse(childNode as Element);
          if (result) {
            return result;
          }
        }
      }
    }

    return "";
  }

  return traverse(document);
}
