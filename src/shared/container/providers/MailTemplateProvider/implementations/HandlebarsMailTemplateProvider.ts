import handlebars from "handlebars";
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";
import fs from 'fs';

class HandleMailTemplateProvider implements IMailTemplateProvider {
    public async parse({file, variables}: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}

export default HandleMailTemplateProvider;