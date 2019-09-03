import * as ts from 'typescript';
declare type ModuleOptions = {
    source: ts.SourceFile;
    symbolName: string;
    modulePath?: string;
};
export declare const addDeclarationToModule: (options: ModuleOptions) => {
    position: any;
    toAdd: string;
}[];
export declare const addImportToModule: (options: ModuleOptions) => {
    position: any;
    toAdd: string;
}[];
export declare const addExportToModule: (options: ModuleOptions) => {
    position: any;
    toAdd: string;
}[];
export declare const ngModuleMetadata: (source: ts.SourceFile) => ts.ObjectLiteralExpression;
export declare const addSymbolToMetadata: (source: ts.SourceFile, metadataField: string, symbolName: string) => {
    position: any;
    toAdd: string;
}[];
export declare function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null;
export declare const nodesByKind: (source: ts.Node, kind: ts.SyntaxKind) => ts.Node[];
export declare const insertImport: (source: ts.SourceFile, symbolName: string, importFrom: string) => {
    position: any;
    toAdd: string;
}[];
export {};
