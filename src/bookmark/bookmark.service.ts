import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async getallBookmarks(userId: number){
        const userss = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if(userss.role === 1) return this.prisma.bookmark.findMany({  
        })

        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })

    }
    
    getBookmarks(userId: number){
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })
    }
 
    async getBookmarkById(userId: number, bookmarkId: number){
        const bookmarkss = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        })

        if(!bookmarkss) return ({msg: "Invalid Bookmark ID"});
        return bookmarkss;

    }


    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            }
        })
        return bookmark;
    }


    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: bookmarkId,
            }
        })

        if(!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resources denied',)
        
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            }
        })
    }


    async deleteBookmarkById(userId: number, bookmarkId: number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: bookmarkId,
            }
        })

        if(!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resources denied',)

        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        })
    }
}
