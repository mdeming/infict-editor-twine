import { join } from "node:path";
import { access } from "node:fs/promises";
import isAbsoluteUrl from "is-absolute-url";
import { builtins } from "../story-formats/defaults";

describe('Story format defaults', () => {
  describe.each(builtins().map(format => [`${format.name} ${format.version}`, format]))('%s', (_, format) => {
    it('exists at the path set', async () => {
      if (isAbsoluteUrl(format.url)) {
        expect(format.url).toMatch(/^https?:\/\//);
        return;
      }
      await expect(access(join(__dirname, '../../../public', format.url))).resolves.toBeUndefined();
    });
  });

  it('should have no duplicate format entries', () => {
    const formats = builtins();
    const uniqueKeys = new Set(
      formats.map(f => `${f.name}-${f.version}`)
    );
    
    expect(uniqueKeys.size).toBe(formats.length);
  });
});