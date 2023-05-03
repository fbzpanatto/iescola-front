export function SetActiveComponentBarTitle(title: string, url: string) {
  return function(target: any) {
    Object.assign(target.prototype, { title, url });
  }
}
