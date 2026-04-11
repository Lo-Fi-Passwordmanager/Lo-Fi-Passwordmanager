import {test as base} from "@playwright/test";
import fs from "fs";
import path from "path";

export const test = base.extend({
    page: async ({ page }, use) => {
        await use(page)

        const coverage = await page.evaluate(() => {
            return (window as any).__coverage__
        })

        if (coverage) {
            const coverageDir = path.join(process.cwd(), '.nyc_output')
            if (!fs.existsSync(coverageDir)) {
                fs.mkdirSync(coverageDir)
            }

            const filePath = path.join(
                coverageDir,
                `coverage-${Date.now()}.json`
            )

            fs.writeFileSync(filePath, JSON.stringify(coverage))
        }
    },
})

export { expect } from '@playwright/test'
