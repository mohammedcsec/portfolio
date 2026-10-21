async (page) => {
  const results = []
  const check = (v, n) => {
    if (!v) throw Error(n)
    results.push(n)
  }
  const base = 'http://localhost:4173/'
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 768, 1600]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of [
      '/about',
      '/contact',
      '/achievements',
      '/research',
      '/research/reproducible-notes',
      '/projects/web-assessment-notebook',
    ]) {
      await page.goto(base + '#' + route)
      await page.getByRole('heading', { level: 1 }).waitFor()
      check(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} fits ${width}px`,
      )
    }
  }
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto(base + '#/research/reproducible-notes')
  await page.getByRole('button', { name: 'Copy code' }).click()
  check(
    (await page.evaluate(() => navigator.clipboard.readText())).includes('node --version'),
    'Clipboard code copy',
  )
  check(await page.getByText('Copied', { exact: true }).isVisible(), 'Copy success feedback')
  await page.goto(base + '#/research')
  await page.getByRole('textbox', { name: 'Search research' }).fill('scope')
  check((await page.locator('.record-card').count()) === 1, 'Research search')
  await page.goto(base)
  const links = await page
    .locator('a[href^="#/"]')
    .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href')))])
  const routes = new Set(links)
  for (const collection of ['projects', 'research', 'achievements']) {
    await page.goto(base + '#/' + collection)
    await page.getByRole('heading', { level: 1 }).waitFor()
    for (const href of await page
      .locator('main a[href^="#/"]')
      .evaluateAll((es) => es.map((e) => e.getAttribute('href'))))
      routes.add(href)
  }
  for (const href of routes) {
    await page.goto(base + href)
    await page.getByRole('heading', { level: 1 }).waitFor()
    check(
      (await page.getByText('No signal here.', { exact: true }).count()) === 0,
      `Advertised link ${href}`,
    )
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(base)
  await page.waitForTimeout(1100)
  check((await page.locator('html.lenis').count()) === 1, 'Lenis active when motion allowed')
  check(
    (await page.locator('.hero h1').evaluate((e) => getComputedStyle(e).opacity)) === '1',
    'Hero visible after entrance',
  )
  return { passed: results.length, results }
}
