class Store<T>{

    map = new Map<number,T>()
    counter = 0

    //add some kind of version number or hash verify
    upserts = new Set<number>()
    deletions = new Set<number>()

    get(id:number){
        return this.map.get(id)
    }

    add(item:T){
        (item as any).id = this.counter++
        return this.insert(item)
    }

    insert(item:any){
        this.map.set((item as any).id,item)
        this.upserts.add(item.id)
        return item
    }

    flag(id:number){
        //would be nicer if flagging was somehow done automatically
        //call this function in the setparent function of entitys
        this.upserts.add(id)
    }

    list(){
        return Array.from(this.map.values())
    }

    remove(id){
        var val = this.map.get(id)
        this.map.delete(id)
        this.deletions.add(id)
        return val
    }

    collectChanges(){
        var upserts = Array.from(this.upserts.entries()).map(e => this.get(e[0]))
        var deletions = Array.from(this.deletions.keys())
        this.upserts.clear()
        this.deletions.clear()
        //add some kind of version number or hash verify
        //optimization potential: if delete id present in upserts cancel them both out
        return {
            upserts,
            deletions,
        }
    }

    applyChanges(deletions:number[],upserts:any[]){
        for(var upsert of upserts){
            var local = this.get(upsert.id)
            if(local == null){
                this.insert(upsert)
            }else{
                Object.assign(local,upsert)
            }
        }

        for(var deletion of deletions){
            this.remove(deletion)
        }
    }
}