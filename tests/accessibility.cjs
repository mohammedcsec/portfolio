async (page) => {
  const results = []
  await page.emulateMedia({reducedMotion:"reduce"})
  for(const width of [375,1280]){
  await page.setViewportSize({width,height:900})
  for (const route of [
    '/',
    '/projects',
    '/research/reproducible-notes',
    '/about',
    '/achievements',
    '/contact',
    '/control-center/',
  ]) {
    await page.goto('http://localhost:5173/#' + route)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.addScriptTag({ path: '/home/user/portfolio/node_modules/axe-core/axe.min.js' })
    const report = await page.evaluate(
      async () =>
        await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        }),
    )
    results.push({
      route, width,
      violations: report.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    })
  }
  }
  return results
}
