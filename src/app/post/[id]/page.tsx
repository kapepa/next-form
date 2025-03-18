import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useGetPostServer } from "@/hooks/use-get-post-server";
import { useProfileMyselfServer } from "@/hooks/use-profile-myself-server";
import { Routers } from "@/types/routers";
import { NextPage } from "next";
import Link from "next/link";

interface PostPageProps {
  params: {
    id: string;
  };
}

const PostPageId: NextPage<PostPageProps> = async (props) => {
  const { id } = props.params;
  const post = await useGetPostServer(id);
  const { profile } = await useProfileMyselfServer();
  const { title, content, images } = post;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {images.map((url, index) => (
              <CarouselItem key={`${url}-${index}`}>
                <div className="p-1">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto max-h-[680px] object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
        </Carousel>
      </CardContent>
      <CardFooter>
        {
          post.authorId === profile._id
          && (
            <Link
              href={`${Routers.Editor}/${id}`}
            >
              <Button
                variant="ghost"
              >
                Edit post
              </Button>
            </Link>
          )
        }
      </CardFooter>
    </Card>
  )
}

export default PostPageId;