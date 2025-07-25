import { create } from "@/http/controller/post/create";
import { CreatePostUseCase } from "@/use-cases/create-post";
import { makeCreatePostUseCase } from "@/use-cases/factory/make-create-post-use-case";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../../../setup/mocks/repository-mocks";
import { mockReply, mockRequest } from "../../../../setup/test-utils";

vi.mock("@/use-cases/factory/make-create-post-use-case", () => ({
  makeCreatePostUseCase: vi.fn(),
}));

describe("Create Post Controller", () => {
  let request: any;
  let reply: any;
  let createPostUseCaseMock: CreatePostUseCase;

  beforeEach(() => {
    request = mockRequest();
    reply = mockReply();
    createPostUseCaseMock = new CreatePostUseCase(mockPostRepository);

    vi.mocked(makeCreatePostUseCase).mockReturnValue(createPostUseCaseMock);
  });

  it("should return 201 and the created post on success", async () => {
    const postData = {
      titulo: "New Post Title",
      resumo: "New Post Summary",
      conteudo: "New Post Content",
      professor_id: 1,
    };
    const createdPost = mockPost(postData);

    request.body = postData;
    vi.spyOn(createPostUseCaseMock, "execute").mockResolvedValue({
      post: createdPost,
    });

    await create(request, reply);

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({ post: createdPost });
    expect(createPostUseCaseMock.execute).toHaveBeenCalledWith(postData);
  });

  it("should return 400 if validation fails (missing title)", async () => {
    request.body = {
      resumo: "New Post Summary",
      conteudo: "New Post Content",
      professor_id: 1,
    };
    const executeSpy = vi.spyOn(createPostUseCaseMock, "execute");

    await create(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error.",
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ["titulo"],
            message: expect.any(String),
          }),
        ]),
      })
    );
    expect(createPostUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails (invalid professor_id)", async () => {
    request.body = {
      titulo: "New Post Title",
      resumo: "New Post Summary",
      conteudo: "New Post Content",
      professor_id: "invalid",
    };
    const executeSpy = vi.spyOn(createPostUseCaseMock, "execute");

    await create(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error.",
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ["professor_id"],
            message: expect.any(String),
          }),
        ]),
      })
    );
    expect(createPostUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it("should throw error if use case throws unexpected error", async () => {
    const error = new Error("Something went wrong");
    request.body = {
      titulo: "New Post Title",
      conteudo: "New Post Content",
      professor_id: 1,
    };
    vi.spyOn(createPostUseCaseMock, "execute").mockRejectedValue(error);

    await expect(create(request, reply)).rejects.toThrow(error);
  });
});
