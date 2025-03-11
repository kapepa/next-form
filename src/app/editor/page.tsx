import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";
import { FormEditor } from "./component/form-editor";

const EditorPage: NextPage = () => {
  return (
    <div
      className="flex justify-center items-center grow"
    >
      <Card
        className="w-full max-w-xl"
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
          <FormEditor />
        </CardContent>
      </Card>
    </div>
  )
}

export default EditorPage;