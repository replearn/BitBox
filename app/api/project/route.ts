import { NextResponse } from "next/server";
import Project from "../../db/models/project";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI || '';

mongoose.connect(uri)


export async function GET(request: Request) {
    try {
        let projects = await Project.find({});
        return NextResponse.json(projects);
    } catch (error: any) {
        return NextResponse.error();
    }

}

export async function POST(request: Request) {
    try {
        const { title, files, lab, languageId } = await request.json();
        let project = await Project.create({ title, files, lab, languageId });
        return NextResponse.json(project);
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.error();
    }

}