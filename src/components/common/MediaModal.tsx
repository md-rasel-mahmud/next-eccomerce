"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import axiosRequest from "@/lib/axios";
import { MediaTypeWithId } from "@/lib/models/media.model";
import { cn, compressImageToFile } from "@/lib/utils";
import {
  Camera,
  CameraIcon,
  Check,
  SearchSlash,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Masonry from "react-masonry-css";
import useSWR, { mutate } from "swr";

interface MediaModalProps {
  onClose: () => void;
  onSelect: (url: string | string[]) => void;
  value?: string;
  isMultiple?: boolean;
}

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  768: 2,
  640: 1,
};

const MediaModal = ({
  onClose,
  onSelect,
  value,
  isMultiple,
}: MediaModalProps) => {
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [tabValue, setTabValue] = useState("all-media");

  const { data: mediaLists, isLoading: mediaListLoading } = useSWR(
    `/media?${searchParams.toString()}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const mediaList = mediaLists?.data;

  const { isLoading: uploadLoading, mutateFn: uploadMutate } =
    useFetchMutation();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file, file.name);
    formData.append("title", file.name);
    formData.append("type", "image");

    try {
      uploadMutate(() =>
        axiosRequest.post("/media", formData).then((res) => {
          mutate(
            `/media?${searchParams.toString()}`,
            (prevData: { data: MediaTypeWithId[] } | undefined) => {
              // Append the new media URL to the existing list
              return {
                ...(prevData || { data: [] }),
                data: [res.data as MediaTypeWithId, ...(prevData?.data || [])],
              };
            },
            false
          );

          setFile(null);

          // If isMultiple is true, we can select multiple media
          if (!isMultiple) {
            onSelect(res.data.url);
            onClose();
          } else {
            setTabValue("all-media");
          }

          return res.data;
        })
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;
    setSelecting(true);

    const blob = await compressImageToFile(targetFile, targetFile.name, 200);

    setSelecting(false);

    setFile(blob || null);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select or Upload Media</DialogTitle>
          <DialogDescription>
            Choose an image from the list or upload a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-media">Media List</TabsTrigger>
            <TabsTrigger value="upload-media">
              <Camera className="mr-2" size={18} /> Upload New Media
            </TabsTrigger>
          </TabsList>

          {
            // SHOW ALL MEDIA LIST ON THIS TAB
          }
          <TabsContent value="all-media">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">All Media</CardTitle>
                {isMultiple && (
                  <CardDescription className="text-center text-sm text-gray-500">
                    Select ⌘ + click / ctrl + click to select multiple images.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <>
                  {mediaListLoading ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                      ))}
                    </div>
                  ) : mediaList.length === 0 ? (
                    <div className="text-gray-500 flex items-center justify-center gap-3 py-10">
                      <SearchSlash /> No media found.
                    </div>
                  ) : (
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="flex gap-4"
                      columnClassName="bg-clip-padding"
                    >
                      {mediaList?.map(
                        (url: { url: string; _id: string }, idx: number) => {
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "mb-4 overflow-hidden rounded-md border hover:border-blue-500 cursor-pointer relative",
                                isMultiple
                                  ? value?.includes(url?.url)
                                  : url?.url === value
                                  ? "border-green-500 border-2"
                                  : "border-gray-200"
                              )}
                              onClick={(e) => {
                                if (isMultiple) {
                                  if (e.metaKey || e.ctrlKey) {
                                    // Multiple selection
                                    const newValue = value
                                      ? Array.isArray(value)
                                        ? value.includes(url.url)
                                          ? value.filter((v) => v !== url.url)
                                          : [...value, url.url]
                                        : [url.url]
                                      : [url.url];

                                    onSelect(newValue);
                                  } else {
                                    // Clear previous selection and select this one
                                    onSelect([url.url]);
                                  }
                                } else {
                                  // Single selection
                                  onSelect(url.url);
                                }
                              }}
                            >
                              {isMultiple
                                ? value?.includes(url?.url) && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full h-6 w-6 leading-[0] flex items-center justify-center">
                                      <Check className="inline" />
                                    </div>
                                  )
                                : url?.url === value && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full h-6 w-6 leading-[0] flex items-center justify-center">
                                      <Check className="inline" />
                                    </div>
                                  )}
                              <Image
                                src={url?.url || "/placeholder.png"}
                                alt={`media-${idx}`}
                                width={300}
                                height={200}
                                className="w-full h-auto object-cover rounded"
                              />
                            </div>
                          );
                        }
                      )}
                    </Masonry>
                  )}
                </>
              </CardContent>
            </Card>
          </TabsContent>

          {
            // UPLOAD MEDIA TAB
          }
          <TabsContent value="upload-media">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Upload Media</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 flex items-center justify-center flex-col ">
                {file ? (
                  <div className="mt-4 flex justify-between w-full bg-background items-center p-3 gap-3 rounded">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Selected file preview"
                      width={150}
                      height={150}
                      className="rounded w-auto h-16"
                    />
                    <span className="text-sm text-gray-700">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>

                    <Button
                      type="button"
                      variant="destructive"
                      className="mt-2"
                      size="sm"
                      onClick={() => setFile(null)}
                      disabled={selecting || uploadLoading}
                    >
                      <X />
                    </Button>
                  </div>
                ) : selecting ? (
                  <p className="text-sm text-gray-500 p-3">
                    Compressing image, please wait...
                  </p>
                ) : (
                  <label className=" border border-dashed rounded overflow-hidden cursor-pointer p-10 w-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors">
                    <CameraIcon />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectFile}
                      className="hidden"
                    />
                  </label>
                )}
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button
                  type="button"
                  className="w-full"
                  disabled={uploadLoading || !file}
                  onClick={handleUpload}
                >
                  {uploadLoading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload /> Upload
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={uploadLoading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={uploadLoading || selecting}
            onClick={onClose}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
