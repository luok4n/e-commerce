"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const rules_1 = require("../rules");
const utils_1 = require("../utils");
const themePackageName = (options) => {
    if (!options.theme)
        return '';
    return `@progress/kendo-theme-${options.theme}`;
};
const themePath = (name) => `node_modules/${name}/dist/all.css`;
function importTheme(options) {
    const theme = themePackageName(options);
    if (!theme)
        return schematics_1.noop();
    const dependencies = {
        [theme]: 'latest'
    };
    return (host, context) => {
        const packageFile = host.get('package.json');
        if (packageFile) {
            const text = packageFile.content.toString();
            const json = JSON.parse(text);
            const dependencies = Object.keys(json.dependencies);
            const skipImport = dependencies.some(dep => dep.startsWith('@progress/kendo-theme-'));
            if (skipImport) {
                context.logger.info(`${theme} already installed, skipping styles registration.`);
                return host;
            }
        }
        return schematics_1.chain([
            rules_1.addToPackageJson({ dependencies }),
            addStyles(theme, options)
        ]);
    };
}
exports.importTheme = importTheme;
function addStyles(theme, options) {
    return (host) => {
        const supportedTargets = new Set(['build', 'test']);
        const workspace = utils_1.getWorkspace(host);
        const project = utils_1.getProjectFromWorkspace(workspace, options.project);
        const targets = project.architect || project.targets;
        if (!targets) {
            throw new schematics_1.SchematicsException(`${project.theme} does not have defined targets.`);
        }
        Object.keys(targets).filter(key => supportedTargets.has(key)).forEach(key => {
            addStyleToTarget(targets[key], host, themePath(theme), workspace);
        });
        return host;
    };
}
function addStyleToTarget(target, host, asset, workspace) {
    const styleEntry = { input: asset };
    // We can't assume that any of these properties are defined, so safely add them as we go
    // if necessary.
    if (!target.options) {
        target.options = { styles: [styleEntry] };
    }
    else if (!target.options.styles) {
        target.options.styles = [styleEntry];
    }
    else {
        const existingStyles = target.options.styles.map(s => typeof s === 'string' ? s : s.input);
        const hasGivenTheme = existingStyles.find(s => s.includes(asset));
        const hasOtherTheme = existingStyles.find(s => s.includes('@progress/kendo-theme'));
        if (!hasGivenTheme && !hasOtherTheme) {
            target.options.styles.splice(0, 0, styleEntry);
        }
    }
    host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
