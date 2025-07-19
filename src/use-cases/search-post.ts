import { PostRepository } from "@/repositories/post.repository";

export class SearchQueryStringUseCase{

    constructor(private  postRepository: PostRepository){}

    handler(query: string){
        return this.postRepository.searchQueryString(query)   
    }

}