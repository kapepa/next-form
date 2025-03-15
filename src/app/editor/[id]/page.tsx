import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";
import { FormEditor } from "../component/form-editor";
import { useGetOwnPostById } from "@/hooks/use-get-own-post-by-id";

interface EditorIdPageProps {
  params: {
    id: string;
  };
}

const EditorIdPage: NextPage<EditorIdPageProps> = async (props) => {
  const { params } = props;
  const { id } = await params;

  const { post } = await useGetOwnPostById(id);

  return (
    <div
      className="flex justify-center items-center grow"
    >
      <Card
        className="w-full max-w-6xl"
      >
        <CardHeader>
          <CardTitle
            className="text-center pb-2 text-xl"
          >
            Editor
          </CardTitle>
          <CardDescription
            className="text-center text-sm"
          >
            Create your own post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormEditor
            post={post}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default EditorIdPage;